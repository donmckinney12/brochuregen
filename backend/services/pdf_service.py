import os
import asyncio
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

async def generate_brochure_pdf(data: dict) -> bytes:
    """
    Generates a PDF brochure from the provided data using an HTML template and Playwright.
    """
    # 1. Render HTML
    template = env.get_template("brochure_template.html")
    html_content = template.render(
        headline=data.get("headline", "Your Headline Here"),
        subheadline=data.get("subheadline", "Your Subheadline Here"),
        about_us=data.get("about_us", "About Us content goes here..."),
        features=data.get("features", ["Feature 1", "Feature 2", "Feature 3"]),
        contact_info=data.get("contact_info", "www.example.com")
    )

    # 2. Convert to PDF using Playwright
    async with async_playwright() as p:
        # Launch browser (headless)
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Set content
        await page.set_content(html_content)

        # Generate PDF (A4 Landscape)
        pdf_bytes = await page.pdf(
            format="A4",
            landscape=True,
            print_background=True,
            margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
        )

        await browser.close()
        return pdf_bytes
