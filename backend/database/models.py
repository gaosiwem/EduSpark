import uuid
from dotenv import load_dotenv
from enum import Enum
from sqlalchemy import JSON, Column, ForeignKey, Integer, String, Boolean, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database.db import Base
from schema_models.schema import SubscriptionStatus

load_dotenv()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    role = Column(String, default="student")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    provider = Column(String, default="local")
    social_id = Column(String, nullable=True)

    subscription_status: SubscriptionStatus = SubscriptionStatus.FREE

    # Relationships
    verification_codes = relationship("VerificationCode", back_populates="user", cascade="all, delete-orphan")
    chat_history = relationship("ChatHistory", back_populates="user", cascade="all, delete-orphan")
    uploaded_files = relationship("UploadedFile", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    xp_gamified_profile = relationship("XPGamifiedProfile", back_populates="user", uselist=False)
    xp_user_badges = relationship("XPUserBadge", back_populates="user")
    xp_quiz_attempts = relationship("XPQuizAttempt", back_populates="user")
    xp_quizzes = relationship("XPQuiz", back_populates="user")

class VerificationCode(Base):
    __tablename__ = "verification_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    code = Column(String, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)

    user = relationship("User", back_populates="verification_codes")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    video_id = Column(String)
    question = Column(String)
    answer = Column(String)
    timestamp = Column(DateTime(timezone=True), default=func.now())

    user = relationship("User", back_populates="chat_history")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, index=True)
    stripe_customer_id = Column(String)
    active = Column(Boolean, default=False)


class UploadedFile(Base):
    __tablename__ = "uploading_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    filename = Column(String, nullable=False)
    file_type = Column(String)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="uploaded_files")
    conversational_files = relationship("ConversationalFiles", back_populates="uploaded_file")


class VideoTranscript(Base):
    __tablename__ = "video_transcripts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String, nullable=False)
    file_hash = Column(String(64), unique=True)
    transcript = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    messages = relationship("ChatMessage", back_populates="conversation", lazy="selectin")
    user = relationship("User", back_populates="conversations")
    conversational_files = relationship("ConversationalFiles", back_populates="conversation")
   

class ConversationalFiles(Base):
    __tablename__ = "converational_files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"))
    uploadedfile_id = Column(UUID(as_uuid=True), ForeignKey("uploading_files.id"))
    
    conversation = relationship("Conversation", back_populates="conversational_files")
    uploaded_file = relationship("UploadedFile", back_populates="conversational_files")
    
    

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"))

    conversation = relationship("Conversation", back_populates="messages")
    
    
    
################ Gamification #####################


##----------Experience Points ---------------#####

class XPGamifiedProfile(Base):
    __tablename__ = "xp_gamified_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    last_login_date = Column(DateTime(timezone=True), server_default=func.now())
    streak = Column(Integer, default=0)

    user = relationship("User", back_populates="xp_gamified_profile")


class XPBadge(Base):
    __tablename__ = "xp_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True)
    description = Column(String)
    icon_url = Column(String)
    criteria = Column(String)

    xp_user_badges = relationship("XPUserBadge", back_populates="badge", cascade="all, delete")


class XPUserBadge(Base):
    __tablename__ = "xp_user_badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    badge_id = Column(UUID(as_uuid=True), ForeignKey("xp_badges.id"))
    date_earned = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="xp_user_badges")
    badge = relationship("XPBadge", back_populates="xp_user_badges")


class XPQuiz(Base):
    __tablename__ = "xp_quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    title = Column(String, nullable=False)
    grade = Column(Integer)
    subject = Column(String)
    is_completed = Column(Boolean, default=False)
    score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="xp_quizzes")
    xp_quiz_attempts = relationship("XPQuizAttempt", back_populates="quiz", cascade="all, delete-orphan")
    questions = relationship("XPQuizQuestions", back_populates="quiz", cascade="all, delete-orphan")
    user_answers = relationship("XPQuizUserAnswer", back_populates="quiz")


class XPQuizAttempt(Base):
    __tablename__ = "xp_quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("xp_quizzes.id"))
    score = Column(Integer)
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="xp_quiz_attempts")
    quiz = relationship("XPQuiz", back_populates="xp_quiz_attempts")


class XPQuizQuestions(Base):
    __tablename__ = "xp_quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("xp_quizzes.id"))
    question = Column(String)

    quiz = relationship("XPQuiz", back_populates="questions")
    options = relationship("XPQuizQuestionsOptions", back_populates="question", cascade="all, delete-orphan")
    user_answers = relationship("XPQuizUserAnswer", back_populates="question")


class XPQuizQuestionsOptions(Base):
    __tablename__ = "xp_quiz_questions_options"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("xp_quiz_questions.id"))
    text = Column(String)
    is_correct = Column(Boolean, default=False)

    question = relationship("XPQuizQuestions", back_populates="options")
    selected_by = relationship("XPQuizUserAnswer", back_populates="selected_option")


class XPQuizUserAnswer(Base):
    __tablename__ = "xp_quiz_user_answers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("xp_quizzes.id"))
    question_id = Column(UUID(as_uuid=True), ForeignKey("xp_quiz_questions.id"))
    selected_option_id = Column(UUID(as_uuid=True), ForeignKey("xp_quiz_questions_options.id"))

    quiz = relationship("XPQuiz", back_populates="user_answers")
    question = relationship("XPQuizQuestions", back_populates="user_answers")
    selected_option = relationship("XPQuizQuestionsOptions", back_populates="selected_by")

##---------- End Experience Points ---------------#####

############## End Gamification ###################
