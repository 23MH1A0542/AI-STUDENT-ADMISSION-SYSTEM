import logging
from typing import List, Dict, Any, Optional
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini SDK if API key is present
if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here":
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        logger.info("Google Gemini SDK configured successfully.")
    except Exception as e:
        logger.error(f"Error configuring Google Gemini: {e}")
else:
    logger.warning("GEMINI_API_KEY not set or invalid. Running in MOCK AI mode.")

def is_ai_configured() -> bool:
    """Returns True if a live Gemini API key is configured, False otherwise."""
    return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here")

def generate_chatbot_response(prompt: str, history: List[Dict[str, str]] = []) -> str:
    """
    Sends chat prompt to Gemini. Uses conversational history.
    """
    system_instruction = (
        "You are the Admissions Assistant for Zenith University. "
        "Answer admissions questions professionally, concisely, and encouragingly. "
        "Admissions criteria: Undergraduate courses require GPA >= 2.5, Statement of Purpose, and Transcript. "
        "General questions about courses, registration, tuition, and deadlines (Sept 1st) are welcome. "
        "If you do not know the answer, politely redirect them to contact admissions@zenith.edu."
    )
    
    if not is_ai_configured():
        # Smart Mock Chat Logic
        prompt_lower = prompt.lower()
        if "gpa" in prompt_lower or "criteria" in prompt_lower or "requirement" in prompt_lower:
            return "Zenith University requires a minimum GPA of 2.5 for general undergraduate admissions. You also need to submit transcripts and a brief Statement of Purpose with your application."
        elif "deadline" in prompt_lower or "when" in prompt_lower:
            return "The final deadline to submit undergraduate admissions applications for the Fall Semester is September 1st. We recommend submitting documents at least 2 weeks prior."
        elif "fee" in prompt_lower or "tuition" in prompt_lower or "cost" in prompt_lower:
            return "Tuition fees vary by department. On average, undergraduate tuition is approximately $8,500 per semester. Financial aid and scholarships are available for students with GPAs above 3.5."
        elif "document" in prompt_lower or "transcript" in prompt_lower or "upload" in prompt_lower:
            return "You can upload files such as your official transcript, identity proof, and letters of recommendation in PDF or JPEG formats directly on your Student Dashboard after creating an application."
        else:
            return "Hello! I am the Zenith Admissions Assistant. I can help answer your questions about courses, admissions criteria (minimum 2.5 GPA), deadlines, and document uploads. How can I assist you today?"

    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=system_instruction
        )
        
        # Format history for Gemini chat structure
        chat = model.start_chat(history=[])
        for msg in history:
            role = "user" if msg["sender"] == "user" else "model"
            # gemini-generativeai expects a specific content block structure
            # To keep it simple, we simulate history by prepending previous dialog
            pass

        # Call generate_content directly with history context to be safe and avoid multi-turn api issues
        context_prompt = ""
        for h in history:
            role_label = "Student" if h["sender"] == "user" else "Assistant"
            context_prompt += f"{role_label}: {h['message']}\n"
        context_prompt += f"Student: {prompt}\nAssistant:"
        
        response = model.generate_content(context_prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error in Gemini generate_chatbot_response: {e}")
        return "I apologize, I am experiencing a temporary technical difficulty processing your request. Please contact admissions@zenith.edu."

def generate_course_recommendations(student_profile: Dict[str, Any], courses: List[Dict[str, Any]]) -> str:
    """
    Sends student interests and course directory to Gemini to return recommended courses.
    """
    if not courses:
        return "There are no courses currently available for enrollment."

    courses_list_str = "\n".join([
        f"- ID {c['id']}: [{c['code']}] {c['name']} (Dept: {c['department']}, Credits: {c['credits']}) - {c['description'] or 'No description'}"
        for c in courses
    ])

    prompt = (
        f"You are an Academic Advisor at Zenith University.\n"
        f"A student has requested course recommendations based on their interests and background:\n"
        f"GPA: {student_profile.get('gpa', 'N/A')}\n"
        f"Interests/Career goals: {student_profile.get('interests', 'Not specified')}\n"
        f"Academic Background: {student_profile.get('background', 'Not specified')}\n\n"
        f"Here is our list of available courses:\n"
        f"{courses_list_str}\n\n"
        f"Please recommend 2-3 specific courses that best match the student's profile. "
        f"For each recommended course, state the Course Code, Name, and explain why it fits their background or interests. "
        f"Conclude with a brief, encouraging remark. Keep the formatting clean with bold text and bullet points."
    )

    if not is_ai_configured():
        # Smart Mock Recommendation Logic
        interests = student_profile.get('interests', '').lower()
        recommended = []
        
        # Match based on keyword
        for c in courses:
            if ("computer" in interests or "tech" in interests or "code" in interests or "software" in interests) and c['department'].lower() == "computer science":
                recommended.append(c)
            elif ("business" in interests or "management" in interests or "finance" in interests) and c['department'].lower() == "business administration":
                recommended.append(c)
            elif ("math" in interests or "data" in interests or "algorithm" in interests) and "math" in c['name'].lower():
                recommended.append(c)
                
        # Fallback to first few courses if no match
        if not recommended:
            recommended = courses[:2]
            
        rec_text = "### Zenith Academic Recommendations\n\nBased on your profile, here are the recommended courses for you:\n\n"
        for rc in recommended:
            rec_text += f"- **{rc['code']}: {rc['name']}**\n"
            rec_text += f"  *Why it fits:* This course aligns well with your goal of developing foundational skills in the {rc['department']} department.\n"
            
        rec_text += "\nWe hope this helps you select your pathway! Feel free to ask more questions."
        return rec_text

    try:
        model = genai.GenerativeModel(model_name=settings.GEMINI_MODEL)
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Error in Gemini generate_course_recommendations: {e}")
        return "We were unable to generate recommendations at this moment. Please review our course catalog page manually."
