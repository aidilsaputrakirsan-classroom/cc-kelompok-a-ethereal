from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=True
    )

    deadline = Column(
            DateTime,
            nullable=True
        )
    
    category = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        default="pending"
    )

    attachment_url = Column(
        String,
        nullable=True
    )

    completed = Column(
        Boolean,
        default=False
    )

    owner_id = Column(
        "created_by",
        Integer,
        nullable=False
    )

    assigned_to = Column(
        Integer,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        onupdate=func.now()
    )