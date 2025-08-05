import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

import auth.auth_service as auth_service


@pytest.mark.asyncio
@patch("auth.auth_service.hash_password", return_value="hashed_pw")
@patch("auth.auth_service.generate_verification_code", return_value="123456")
async def test_create_user_success(mock_generate_code, mock_hash_password):
    session = AsyncMock(spec=AsyncSession)
    mock_user = MagicMock()
    mock_user.id = 1

    # Simulate flush + refresh returning the user with ID
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.add = MagicMock()

    result = await auth_service.create_user(
        email="test@example.com",
        password="password123",
        session=session
    )

    mock_hash_password.assert_called_once_with("password123")
    mock_generate_code.assert_called_once()

    session.add.assert_called()  # user + verification
    session.commit.assert_called()
    session.refresh.assert_called()

    assert result["user_id"] == mock_user.id or isinstance(result["user_id"], int)
    assert result["verification_code"] == "123456"


@pytest.mark.asyncio
@patch("auth.auth_service.generate_verification_code", return_value="999999")
async def test_create_user_social_only(mock_generate_code):
    session = AsyncMock(spec=AsyncSession)
    session.commit = AsyncMock()
    session.refresh = AsyncMock()
    session.add = MagicMock()

    result = await auth_service.create_user(
        email="google@example.com",
        password="",
        provider="google",
        session=session
    )

    session.add.assert_called()
    session.commit.assert_called()
    assert result["verification_code"] == ""


@pytest.mark.asyncio
async def test_verify_user_email_success():
    session = AsyncMock(spec=AsyncSession)

    # Mock user and verification result
    mock_user = MagicMock()
    mock_user.id = 10
    session.execute = AsyncMock(side_effect=[
        MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_user)))),
        MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=MagicMock())))),
    ])

    session.commit = AsyncMock()

    result = await auth_service.verify_user_email("user@example.com", "123456", session=session)
    assert result is True
    session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_verify_user_email_user_not_found():
    session = AsyncMock(spec=AsyncSession)
    session.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=None)))))
    result = await auth_service.verify_user_email("noone@example.com", "123456", session=session)
    assert result is False


@pytest.mark.asyncio
async def test_login_user_success():
    session = AsyncMock(spec=AsyncSession)
    mock_user = MagicMock()
    mock_user.email = "user@example.com"
    mock_user.password_hash = "hashed"

    with patch("auth.auth_service.verify_password", return_value=True):
        session.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_user)))))
        result = await auth_service.login_user("user@example.com", "password", session=session)
        assert result == mock_user


@pytest.mark.asyncio
async def test_login_user_wrong_password():
    session = AsyncMock(spec=AsyncSession)
    mock_user = MagicMock()
    mock_user.email = "user@example.com"
    mock_user.password_hash = "wronghash"

    with patch("auth.auth_service.verify_password", return_value=False):
        session.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=mock_user)))))
        result = await auth_service.login_user("user@example.com", "wrongpass", session=session)
        assert result is None


@pytest.mark.asyncio
async def test_reset_password_success():
    session = AsyncMock(spec=AsyncSession)
    user = MagicMock()
    user.id = 1

    session.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=user)))))
    session.commit = AsyncMock()

    with patch("auth.auth_service.hash_password", return_value="hashed_new"):
        result = await auth_service.reset_password("reset@example.com", "newpass", session=session)
        assert result is True
        session.commit.assert_called_once()


@pytest.mark.asyncio
async def test_reset_password_user_not_found():
    session = AsyncMock(spec=AsyncSession)
    session.execute = AsyncMock(return_value=MagicMock(scalars=MagicMock(return_value=MagicMock(first=MagicMock(return_value=None)))))

    with patch("auth.auth_service.hash_password", return_value="x"):
        result = await auth_service.reset_password("notfound@example.com", "x", session=session)
        assert result is False
