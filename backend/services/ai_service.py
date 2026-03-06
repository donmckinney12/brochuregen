import os
import json
from openai import AsyncOpenAI

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY is not set.")
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def generate_brochure_content(self, text_content: str, url: str, is_campaign: bool = False) -> dict:
        """
        Uses OpenAI (gpt-4o) to analyze the provided website text and generate 
        marketing copy for a 3-fold brochure, and optionally a full campaign.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        # Truncate text to avoid token limits if necessary (naive truncation)
        truncated_text = text_content[:20000]
        
        campaign_instructions = ""
        if is_campaign:
            campaign_instructions = """
        ADDITIONALLY, because this is a full campaign, you must include two more keys in the JSON:
        7. "social_posts": A list of exactly 4 items. 3 LinkedIn posts and 1 Twitter/X thread (indicate the platform in the text or preface it). Make them engaging and ready to post.
        8. "email_sequence": A list of exactly 3 emails for a drip sequence (e.g., [ {"subject": "...", "body": "..."}, {"subject": "...", "body": "..."}, {"subject": "...", "body": "..."} ]). Include Subject lines and Bodies for Welcome, Value Drop, and Call to Action.
            """

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
        {campaign_instructions}
        
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

    async def refine_text_snippet(self, text: str, action: str) -> dict:
        """
        Refines a specific text snippet based on the requested action.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        prompt = f"""
        You are an expert copywriter. The user wants to refine the following text snippet.
        
        Original Text: "{text}"
        Style/Action requested: "{action}"
        
        Provide the refined version of the text. Do not include any conversational filler, just the raw refined text.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a direct, professional copywriting assistant. Output only the requested text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            refined = response.choices[0].message.content.strip()
            # Remove quotes if the AI wrapped the response in them
            if refined.startswith('"') and refined.endswith('"'):
                refined = refined[1:-1]
                
            return {"status": "success", "refined_text": refined}
            
        except Exception as e:
            print(f"Error calling OpenAI for refinement: {e}")
            return {"error": f"Failed to refine text: {str(e)}"}

    async def translate_json(self, json_data: dict, target_language: str) -> dict:
        """
        Translates all string values in a JSON object to the target language, 
        maintaining the exact original key structure.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        prompt = f"""
        You are an expert, professional translator specializing in marketing copy.
        Translate the values in the following JSON into {target_language}.
        
        CRITICAL RULES:
        1. Maintain the exact same JSON key structure.
        2. Only translate the text values.
        3. Do NOT translate email subjects/bodies or social media text if they contain platform-specific tags or variables you aren't sure about, but DO translate the main prose.
        4. Return ONLY the translated JSON.
        
        Source JSON:
        {json.dumps(json_data)}
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a professional localization assistant that outputs strictly valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.3 # Lower temp for more accurate translation
            )
            
            content = response.choices[0].message.content
            return {"status": "success", "translated_data": json.loads(content)}
            
        except Exception as e:
            print(f"Error calling OpenAI for translation: {e}")
            return {"error": f"Failed to translate content: {str(e)}"}

    async def generate_bespoke_image(self, prompt: str) -> dict:
        """
        Uses DALL-E 3 to generate a high-quality marketing hero image based on
        the provided prompt.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        try:
            response = await self.client.images.generate(
                model="dall-e-3",
                prompt=f"A professional, high-end marketing hero image for: {prompt}. Modern aesthetic, clean composition, studio lighting, commercial quality.",
                size="1024x1024",
                quality="standard",
                n=1,
            )

            image_url = response.data[0].url
            return {"status": "success", "image_url": image_url}

        except Exception as e:
            print(f"Error calling DALL-E: {e}")
            return {"error": f"Failed to generate image: {str(e)}"}
