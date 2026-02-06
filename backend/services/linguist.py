
import os
from openai import OpenAI
from dotenv import load_dotenv
from .librarian import ScientificLibrarian

load_dotenv()

class CognitiveLinguist:
    """
    The Linguist Agent: Responsible for generating human-like, 
    personalized cognitive insights grounded in scientific context.
    """
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None
        # Initialize the Librarian for RAG capabilities
        self.librarian = ScientificLibrarian()

    def generate_daily_insight(self, archetype: str, score: float):
        """
        Generates a 2-sentence insight based on the user's archetype and most recent score.
        Uses Librarian for RAG and OpenAI GPT-4o for generation.
        """
        # Step 1: Retrieve scientific context via the Librarian Agent
        context = self.librarian.retrieve_context(archetype)
        
        # Mock Logic / Safety Net
        if not self.client:
            templates = {
                "Cyber-Athlete": f"Exceptional velocity detected. Your {score}ms response reflects elite-level neural efficiency. Keep pushing your limits.",
                "Impulsive Sprinter": f"You're fast ({score}ms), but precision is wavering. Focus on 'slowing down to speed up' to stabilize your accuracy.",
                "Deep Thinker": f"Methodical and precise. While your {score}ms latency is higher, your accuracy is your greatest strategic asset in complex tasks.",
                "Novice": f"Baseline established at {score}ms. Consistent daily training will shrink this latency and sharpen your executive focus."
            }
            return f"[Mock] {templates.get(archetype, f'Great job acting like a {archetype}!')}"

        # Step 2: Real Logic using LLM augmented with the retrieved scientific context
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", 
                        "content": f"You are MindMetricAI. Use the following SCIENTIFIC CONTEXT to answer the user: {context}. Be concise, motivating, and scientific. Speak directly to the user."
                    },
                    {
                        "role": "user", 
                        "content": f"User's current archetype is '{archetype}'. Their recent reaction time is {score}ms. Give them a 2-sentence insight."
                    }
                ],
                max_tokens=100,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Linguist Agent Error: {str(e)}")
            return f"Analyzing your data... your current {archetype} status indicates strong potential for cognitive growth."

    def generate_chat_response(self, user_message: str, archetype: str, context: str):
        """
        Generates a conversational response for the AI Coach interface.
        """
        if not self.client:
            return f"[Mock Coach] I see you're asking about your performance as a {archetype}. Scientifically speaking: {context[:100]}... To give you a better answer, please configure my OpenAI API key!"

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "system", 
                        "content": f"You are MindMetricAI, an elite cognitive coach. The user is currently identified as a '{archetype}'. Use the following scientific context: {context}. Be helpful, data-driven, and brief."
                    },
                    {
                        "role": "user", 
                        "content": user_message
                    }
                ],
                max_tokens=250,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Linguist Chat Error: {str(e)}")
            return "I'm processing your cognitive data right now. My connection to the neural network is slightly delayed, but your performance metrics look solid."
