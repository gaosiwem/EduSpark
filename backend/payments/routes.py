import stripe
import os
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import JSONResponse

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@router.post("/create-checkout-session")
async def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types = ["card"],
            model = "subscription",
            line_items =[{
                "price": os.getenv("STRIPE_PRICE_ID"),
                "quantity" : 1,
            }],
            success_url = "http://localhost:3000/success",
            cancel_url = "http://localhost:3000/cancel"
        )
        
        return {"url": checkout_session.url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
        
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    
     # Handle subscription updates, payment success, etc.
    if event["type"] == "customer.subscription.updated":
        subscription = event["data"]["object"]
        # TODO: Update user subscription status in DB
    elif event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # TODO: Mark subscription active for user
    
    return {"status": "success"}
         
         
         