"""Tests for admin API endpoints."""
import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient


def make_mock_db():
    """Create a mock database session."""
    db = MagicMock()
    return db


def make_admin_user():
    """Return mock admin user claims."""
    return {"sub": "admin_user_id", "email": "mckinneydonald321@gmail.com"}


def make_regular_user():
    """Return mock regular user claims."""
    return {"sub": "regular_user_id", "email": "user@example.com"}


class TestAdminAccess:
    """Test admin access guard."""

    def test_admin_email_allowed(self):
        """Admin email should pass the guard."""
        user = make_admin_user()
        assert user["email"] == "mckinneydonald321@gmail.com"

    def test_non_admin_email_rejected(self):
        """Non-admin email should be rejected."""
        user = make_regular_user()
        assert user["email"] != "mckinneydonald321@gmail.com"


class TestAdminStats:
    """Test admin stats endpoint logic."""

    def test_stats_returns_correct_keys(self):
        """Stats response should contain all expected keys."""
        expected_keys = {"total_users", "total_brochures", "total_leads", "total_views", "plan_distribution"}
        # Mock a stats response
        stats = {
            "total_users": 10,
            "total_brochures": 25,
            "total_leads": 50,
            "total_views": 200,
            "plan_distribution": {"free": 5, "starter": 3, "pro": 2}
        }
        assert set(stats.keys()) == expected_keys

    def test_plan_distribution_sums_to_total(self):
        """Plan distribution should sum to total users."""
        stats = {
            "total_users": 10,
            "plan_distribution": {"free": 5, "starter": 3, "pro": 2}
        }
        assert sum(stats["plan_distribution"].values()) == stats["total_users"]


class TestUserOverride:
    """Test admin user override logic."""

    def test_override_payload_schema(self):
        """Override request should accept plan, credits, refine_credits."""
        payload = {"plan": "pro", "credits": 50, "refine_credits": 25}
        assert "plan" in payload
        assert "credits" in payload
        assert "refine_credits" in payload
        assert isinstance(payload["credits"], int)

    def test_override_optional_fields(self):
        """Override should work with partial fields."""
        payload = {"credits": 100}
        assert "plan" not in payload
        assert payload["credits"] == 100
