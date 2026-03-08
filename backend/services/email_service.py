import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM_NAME = os.environ.get("SMTP_FROM_NAME", "BrochureGen")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", SMTP_USER)


def create_branded_html(subject: str, body: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
            <div style="text-align:center;margin-bottom:32px;">
                <span style="font-size:24px;font-weight:900;font-style:italic;letter-spacing:-1px;color:#fff;">BROCHUREGEN</span>
            </div>
            <div style="background:#111;border:1px solid #222;border-radius:16px;padding:32px;color:#ccc;font-size:14px;line-height:1.8;">
                <h2 style="color:#fff;font-size:18px;font-weight:700;margin:0 0 16px 0;">{subject}</h2>
                {body}
            </div>
            <div style="text-align:center;margin-top:32px;color:#444;font-size:11px;">
                Sent via BrochureGen Neural Protocol
            </div>
        </div>
    </body>
    </html>
    """


def send_email(to_email: str, subject: str, body_html: str) -> dict:
    if not SMTP_USER or not SMTP_PASSWORD:
        return {"success": False, "error": "SMTP credentials not configured. Add SMTP_USER and SMTP_PASSWORD to .env"}

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
        msg["To"] = to_email

        html_content = create_branded_html(subject, body_html)
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)

        print(f"Email sent to {to_email}: {subject}")
        return {"success": True}
    except Exception as e:
        print(f"Email send failed: {e}")
        return {"success": False, "error": str(e)}
