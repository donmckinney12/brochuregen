import os
import json
from openai import AsyncOpenAI

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY is not set.")
        self.client = AsyncOpenAI(api_key=self.api_key)

    TONE_PRESETS = {
        "professional": "Professional, polished, and authoritative. Use precise language.",
        "casual": "Casual, friendly, and conversational. Use simple, approachable language.",
        "bold": "Bold, daring, and attention-grabbing. Use power words and urgency.",
        "luxury": "Luxurious, refined, and exclusive. Use elegant, aspirational language.",
        "playful": "Playful, fun, and energetic. Use humor and creative metaphors.",
        "minimal": "Minimalist and concise. Less is more. Every word counts.",
    }

    async def generate_brochure_content(self, text_content: str, url: str, is_campaign: bool = False, brand_voice: str = None, tone: str = None) -> dict:
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

        # Resolve tone
        tone_instruction = ""
        if tone and tone in self.TONE_PRESETS:
            tone_instruction = f"\n        TONE DIRECTIVE (CRITICAL): Write all copy in this tone: {self.TONE_PRESETS[tone]}"

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
        
        BRAND VOICE CALIBRATION (CRITICAL):
        The user has specific brand guidelines you must follow. 
        Tone/Style: {brand_voice if brand_voice else "Professional, modern, and engaging."}{tone_instruction}
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

    async def extract_brand_voice(self, text_content: str) -> dict:
        """
        Analyzes website content to extract a brand voice profile.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        truncated_text = text_content[:15000]
        
        prompt = f"""
        You are an expert brand strategist. Analyze the following website content and extract a high-fidelity "Neural Voice Profile".
        
        Content:
        {truncated_text}
        
        Please provide a concise but deep distillation of the brand's identity:
        1. "tone": The primary emotional frequency (e.g., "Executive & Stoic", "Playful & Disruptive").
        2. "messaging_pillars": 3 key value drivers found in the copy.
        3. "target_audience": Who is this copy speaking to?
        4. "calibration_snippet": A 1-paragraph synthesis (3-4 sentences) that can be used to "train" an AI to write like this brand.
        
        Return ONLY valid JSON.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a brand strategy assistant that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.5
            )
            
            content = response.choices[0].message.content
            return {"status": "success", "voice_profile": json.loads(content)}
            
        except Exception as e:
            print(f"Error extracting brand voice: {e}")
            return {"error": f"Failed to extract brand voice: {str(e)}"}

    async def generate_variant(self, original_content: dict) -> dict:
        """
        Generates a high-conversion variant of existing brochure content for A/B testing.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        prompt = f"""
        You are a conversion optimization expert. Generate a "Challenger" variant (Variant B) of the following brochure content to A/B test against the original.
        
        Original Content:
        {original_content}
        
        Requirements for Variant B:
        1. "headline": Create a more aggressive, more emotional, or more curiosity-driven headline.
        2. "subheadline": Refine the subheadline to focus on a different pain point or a more specific benefit.
        3. "cta_text": Create a high-friction or ultra-low-friction alternative (e.g., "Get Immediate Access" vs "Talk to a Strategist").
        
        Keep the "about_us" and "features" similar but feel free to punch up the copy.
        
        Return ONLY valid JSON matching the structure of the original content but with these modifications.
        """

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a conversion copywriter that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            variant_data = json.loads(response.choices[0].message.content)
            return {"status": "success", "variant": variant_data}
        except Exception as e:
            print(f"Error generating variant: {e}")
            return {"error": str(e)}

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

    async def generate_followup_sequence(self, lead_data: dict, brochure_context: dict) -> dict:
        """
        Generates a 3-step personalized email follow-up sequence.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        try:
            prompt = f"""
            System: You are an elite sales growth strategist specialized in lead nurturing.
            Task: Generate a 3-step personalized "Neural Follow-up" email sequence for the following lead.
            
            Target Lead:
            - Name: {lead_data.get('name')}
            - Company: {lead_data.get('company')}
            - Inquiry: "{lead_data.get('message')}"
            
            Context (The brochure they just viewed):
            - Topic: {brochure_context.get('title')}
            - Headline: {brochure_context.get('headline')}
            
            Protocol Requirements:
            1. Step 1 (Immediate Sync): A follow-up that acknowledges their specific inquiry and provides immediate value (e.g., a relevant insight or a link to a resource).
            2. Step 2 (Strategic Anchor): Sent 2 days later. PIVOT to a deeper strategic question or case study reference.
            3. Step 3 (Hard Conversion): Sent 5 days later. A strong, bold call-to-action to book a strategy sync.
            
            Tone: High-end, assertive, professional, and bespoke.
            
            Return format: Return ONLY a JSON object with a 'sequence' key which is an array of 3 objects: [{{ "step": 1, "subject": "...", "body": "..." }}, ...]
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a sales automation expert that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            res = json.loads(response.choices[0].message.content)
            return {"status": "success", "sequence": res.get("sequence", [])}
        except Exception as e:
            print(f"Error generating follow-up: {e}")
            return {"error": str(e)}

    async def generate_seo_metadata(self, title: str, content: dict) -> dict:
        """
        Generates high-CTR SEO meta tags for a brochure.
        """
        if not self.api_key:
            return {"error": "OpenAI API key missing"}

        try:
            prompt = f"""
            System: You are an SEO and Meta-Tag conversion specialist.
            Task: Generate optimized HTML meta tags for the following brochure content.
            
            Brochure Title: {title}
            Key Content: {json.dumps(content, indent=2)}
            
            Requirements:
            1. "meta_title": A provocative, benefit-driven title (max 60 chars).
            2. "meta_description": A high-conversion summary that creates curiosity (max 160 chars).
            3. "og_title": Optimized for social sharing (bold, punchy).
            4. "og_description": Engaging social snippet.
            5. "keywords": 5-7 high-intent keywords.
            
            Return ONLY a valid JSON object.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an SEO expert that outputs only JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            
            res = json.loads(response.choices[0].message.content)
            return {"status": "success", "metadata": res}
        except Exception as e:
            print(f"Error generating SEO metadata: {e}")
            return {"error": str(e)}

    async def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generic rapid completion for concierge suggestions and micro-tasks.
        """
        if not self.api_key:
            return "Auth failure: API key missing"

        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Completion failure: {e}")
            return "Internal synthesis error. Retrying protocol..."
