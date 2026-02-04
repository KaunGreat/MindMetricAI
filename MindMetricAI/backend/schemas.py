from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class TestResultBase(BaseModel):
    test_type: str
    score: float
    accuracy: float

class TestResultCreate(TestResultBase):
    pass

class TestResultOut(TestResultBase):
    id: int
    archetype: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True