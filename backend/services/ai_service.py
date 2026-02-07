import os
import json
from openai import AsyncOpenAI

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY is not set.")
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def generate_brochure_content(self, text_content: str, url: str) -> dict:
        """
        Uses OpenAI (gpt-4o) to analyze the provided website text and generate 
        marketing copy for a 3-fold brochure.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        # Truncate text to avoid token limits if necessary (naive truncation)
        # GPT-4o has a large context, but let's be safe and keep it reasonable (e.g., 20k chars)
        truncated_text = text_content[:20000]

        prompt = f"""
        You are an expert marketing copywriter. Your goal is to create high-converting copy for a 3-fold brochure based on the following website content.
        
        Website URL: {url}
        
        Content:
        {truncated_text}
        
        Please extract and creatively write the following sections in a structured JSON format:
        1. "headline": A punchy, catchy title for the front cover.
        2. "subheadline": A supporting value proposition.
        3. "about_us": A concise description of the business (2-3 sentences).
        4. "features": A list of 3-5 key selling points or features (short bullet points).
        5. "contact_info": Phone, email, or address if found (or "Visit our website").
        6. "testimonials": A list of 1-2 testimonials if found, or create a generic placeholder based on the vibe.
        
        Return ONLY valid JSON.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a helpful marketing assistant that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"Error calling OpenAI: {e}")
            return {"error": f"Failed to generate AI content: {str(e)}"}
