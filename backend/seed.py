import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User
from app.models.course import Course

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_db():
    db = SessionLocal()
    try:
        # Create tables if they don't exist (failsafe)
        Base.metadata.create_all(bind=engine)
        
        # 1. Seed Admin User
        admin_email = "admin@admissions.edu"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            admin = User(
                email=admin_email,
                hashed_password=get_password_hash("adminpassword123"),
                full_name="Admissions Administrator",
                role="admin"
            )
            db.add(admin)
            logger.info("Admin user seeded.")
        else:
            logger.info("Admin user already exists.")

        # 2. Seed Student User
        student_email = "student@admissions.edu"
        student = db.query(User).filter(User.email == student_email).first()
        if not student:
            student = User(
                email=student_email,
                hashed_password=get_password_hash("studentpassword123"),
                full_name="Sample Student",
                role="student"
            )
            db.add(student)
            logger.info("Sample student user seeded.")
        else:
            logger.info("Sample student user already exists.")

        # 3. Seed Courses
        sample_courses = [
            {
                "code": "CS101",
                "name": "Introduction to Programming",
                "description": "Fundamental programming concepts using Python. Topics include variables, loops, functions, and object-oriented programming.",
                "department": "Computer Science",
                "credits": 3,
                "capacity": 50,
                "is_active": True
            },
            {
                "code": "CS202",
                "name": "Data Structures & Algorithms",
                "description": "In-depth study of stacks, queues, linked lists, trees, graphs, sorting, searching, and algorithmic complexity.",
                "department": "Computer Science",
                "credits": 4,
                "capacity": 40,
                "is_active": True
            },
            {
                "code": "BA101",
                "name": "Principles of Management",
                "description": "Overview of managerial functions including planning, organizing, leading, and controlling in modern organizations.",
                "department": "Business Administration",
                "credits": 3,
                "capacity": 60,
                "is_active": True
            },
            {
                "code": "BA305",
                "name": "Marketing & Public Relations",
                "description": "Examines buyer behavior, market segmentation, product positioning, pricing strategy, distribution, and promotional campaigns.",
                "department": "Business Administration",
                "credits": 3,
                "capacity": 45,
                "is_active": True
            },
            {
                "code": "MATH110",
                "name": "Calculus I",
                "description": "Introduction to differential calculus, limits, continuity, rates of change, derivatives, and integral calculus applications.",
                "department": "Mathematics",
                "credits": 4,
                "capacity": 35,
                "is_active": True
            },
            {
                "code": "ENG102",
                "name": "Academic Writing & Research",
                "description": "Develops critical thinking, rhetorical analysis, synthesis, research methodology, and writing skills for academic papers.",
                "department": "English Literature",
                "credits": 3,
                "capacity": 30,
                "is_active": True
            }
        ]
        
        for c_data in sample_courses:
            course = db.query(Course).filter(Course.code == c_data["code"]).first()
            if not course:
                course = Course(**c_data)
                db.add(course)
                logger.info(f"Course {c_data['code']} seeded.")
            else:
                logger.info(f"Course {c_data['code']} already exists.")
                
        db.commit()
        logger.info("Database seeding completed successfully.")
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
