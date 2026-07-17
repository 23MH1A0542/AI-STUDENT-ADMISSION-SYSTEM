from sqlalchemy import Column, Integer, String, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. CS101
    name = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    department = Column(String, index=True, nullable=False) # e.g. Computer Science
    credits = Column(Integer, default=3, nullable=False)
    capacity = Column(Integer, default=50, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    applications = relationship("Application", back_populates="course")
