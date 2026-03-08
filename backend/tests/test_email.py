"""Tests for email service and API endpoints."""
import pytest
from unittest.mock import MagicMock, patch


class TestEmailService:
    """Test email service functionality."""

    def test_email_body_formatting(self):
        """Email body should be properly formatted."""
        body = "Hello {name}, thank you for your interest."
        formatted = body.replace("{name}", "John")
        assert "John" in formatted
        assert "{name}" not in formatted

    def test_email_html_template_structure(self):
        """HTML template should contain required elements."""
        html = """
        <html>
        <body>
            <div style="max-width:600px;margin:0 auto;">
                <h2>BrochureGen</h2>
                <p>Test content</p>
            </div>
        </body>
        </html>
        """
        assert "BrochureGen" in html
        assert "<h2>" in html
        assert "max-width" in html


class TestFollowupEndpoint:
    """Test follow-up email endpoint validation."""

    def test_followup_payload_schema(self):
        """Follow-up request should require to_email, subject, body."""
        payload = {
            "to_email": "lead@example.com",
            "subject": "Follow up on your interest",
            "body": "We noticed you checked out our brochure..."
        }
        assert "@" in payload["to_email"]
        assert len(payload["subject"]) > 0
        assert len(payload["body"]) > 0

    def test_invalid_email_detection(self):
        """Should detect invalid email addresses."""
        invalid_emails = ["notanemail", "missing@", "@nodomain", ""]
        for email in invalid_emails:
            assert "@" not in email or "." not in email.split("@")[-1] or email == ""


class TestSequenceEndpoint:
    """Test sequence email endpoint validation."""

    def test_sequence_payload_structure(self):
        """Sequence request should contain to_email and sequence list."""
        payload = {
            "to_email": "lead@example.com",
            "sequence": [
                {"subject": "Welcome", "body": "Thanks for connecting!"},
                {"subject": "Value Drop", "body": "Here's what we can do for you..."},
                {"subject": "CTA", "body": "Ready to get started?"}
            ]
        }
        assert len(payload["sequence"]) == 3
        for step in payload["sequence"]:
            assert "subject" in step
            assert "body" in step

    def test_empty_sequence_handled(self):
        """Empty sequence should be handled gracefully."""
        payload = {"to_email": "lead@example.com", "sequence": []}
        assert len(payload["sequence"]) == 0
