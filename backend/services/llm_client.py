import json
import os
from openai import OpenAI, APIError

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_answer(prompt: str) -> str:
    
    """Generate an answer using OpenAI's GPT model."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7
        )
        
        return response.choices[0].message.content.strip()
    except APIError as e:
        print(f"OpenAI API error: {e}")
        return "An error occurred while generating the answer."
    
    
def summarize(text: str) -> str:
    prompt = (
        "Summarize the following text clearly and concisely. "
        "You may internally imagine diagrams, flowcharts, or layouts to understand the structure, "
        "but do not mention, describe, or refer to any diagram, chart, or visual in your output. "
        "Only return a clean summary in plain text.\n\nText:\n\n" + text
    )
    
    try:
        response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text and suggests diagrams when appropriate."},
                    {"role": "user", "content": prompt}
                 ],
                temperature=0.5,
                max_tokens=700,
        )
        
        return response.choices[0].message.content.strip()
    except APIError as e:
        print(f"OpenAI API error: {e}")
        return "An error occurred while generating the answer."

def chat_response(text: str) -> str:
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that response to text and help with learning."},
                        {"role": "user", "content": text}
                    ],
        )
        return response.choices[0].message.content.strip()
  
    except APIError as e:
        print(f"OpenAI API error: {e}")
        return "An error occurred while generating the answer."
    
def create_title(text: str):
    prompt = f"""You are an assistant. Generate a short 3-6 word title based on this message:    
    User: {text}    
    Return only the title. No explanations."""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a title generator."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=20,
    )
    
    return response.choices[0].message.content.strip()

def create_quiz(transcript: str, grade: int, subject: str, numberOfQuestions: int = 5):
    
    prompt = f"""
    You are an educational AI generating quizzes for the South African CAPS curriculum (public and private schools).

    Based on the following content transcript, generate {numberOfQuestions} CAPS-aligned multiple-choice questions (Grade {grade}, Subject: {subject}).

    Each question must include:
    - question text
    - four answer options (A-D)
    - the correct answer key
    - an explanation

    Format the output as a JSON list:
    [
      {{
        "question": "...",
        "options": {{
          "A": "...",
          "B": "...",
          "C": "...",
          "D": "..."
        }},
        "correct": "A",
        "explanation": "..."
      }}
    ]

    Transcript:
    {transcript}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
    )
    
    try:
        content = response.choices[0].message.content
        print(content)
        
        if content.startswith("```"):
            content = content.strip("`").strip()
            # optionally strip 'json' prefix
            if content.lower().startswith("json"):
                content = content[4:].strip()
        
        return json.loads(content)
    except json.JSONDecodeError as e:
        print("AI raw content:", content)
        raise ValueError(f"Failed to parse AI response: {e}")