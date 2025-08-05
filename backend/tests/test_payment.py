import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from payments.routes import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)

@pytest.fixture
def client():
    return TestClient(app)

@patch("payments.routes.stripe.checkout.Session.create")
@patch("payments.routes.os.getenv")
def test_create_checkout_session_success(mock_getenv, mock_stripe_create, client):
    # Arrange
    mock_getenv.side_effect = lambda key: "test_price_id" if key == "STRIPE_PRICE_ID" else "sk_test"
    mock_session = MagicMock()
    mock_session.url = "https://checkout.stripe.com/test_session"
    mock_stripe_create.return_value = mock_session

    # Act
    response = client.post("/create-checkout-session")

    # Assert
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"url": "https://checkout.stripe.com/test_session"}
    mock_stripe_create.assert_called_once()
    args, kwargs = mock_stripe_create.call_args
    assert kwargs["payment_method_types"] == ["card"]
    assert kwargs["model"] == "subscription"
    assert kwargs["line_items"][0]["price"] == "test_price_id"
    assert kwargs["line_items"][0]["quantity"] == 1

@patch("payments.routes.stripe.checkout.Session.create")
@patch("payments.routes.os.getenv")
def test_create_checkout_session_failure(mock_getenv, mock_stripe_create, client):
    # Arrange
    mock_getenv.side_effect = lambda key: "test_price_id" if key == "STRIPE_PRICE_ID" else "sk_test"
    mock_stripe_create.side_effect = Exception("Stripe error")

    # Act
    response = client.post("/create-checkout-session")

    # Assert
    assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    assert response.json() == {"detail": "Stripe error"}

@pytest.fixture
def stripe_event():
    return {
        "type": "customer.subscription.updated",
        "data": {"object": {"id": "sub_123"}}
    }

@pytest.fixture
def checkout_event():
    return {
        "type": "checkout.session.completed",
        "data": {"object": {"id": "sess_123"}}
    }

def test_stripe_webhook_subscription_updated(client, stripe_event):
    payload = b"{}"
    sig_header = "test_signature"

    with patch("stripe.Webhook.construct_event") as mock_construct_event:
        mock_construct_event.return_value = stripe_event
        response = client.post(
            "/webhook",
            data=payload,
            headers={"stripe-signature": sig_header}
        )
        assert response.status_code == 200
        assert response.json() == {"status": "success"}
        mock_construct_event.assert_called_once()

def test_stripe_webhook_checkout_completed(client, checkout_event):
    payload = b"{}"
    sig_header = "test_signature"

    with patch("stripe.Webhook.construct_event") as mock_construct_event:
        mock_construct_event.return_value = checkout_event
        response = client.post(
            "/webhook",
            data=payload,
            headers={"stripe-signature": sig_header}
        )
        assert response.status_code == 200
        assert response.json() == {"status": "success"}
        mock_construct_event.assert_called_once()

def test_stripe_webhook_invalid_signature(client):
    payload = b"{}"
    sig_header = "bad_signature"

    with patch("stripe.Webhook.construct_event", side_effect=Exception("Invalid signature")):
        response = client.post(
            "/webhook",
            data=payload,
            headers={"stripe-signature": sig_header}
        )
        assert response.status_code == 400
        assert "error" in response.json()