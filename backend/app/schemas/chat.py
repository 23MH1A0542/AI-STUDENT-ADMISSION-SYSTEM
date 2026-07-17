from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ChatBase(BaseModel):
    message: str
    sender: str # "user" or "bot"

class ChatCreate(BaseModel):
    message: str

class ChatOut(ChatBase):
    id: int
    user_id: Optional[int] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
