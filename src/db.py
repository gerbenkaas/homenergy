from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from webapp.backend.settings import db_url

engine = create_engine(db_url)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
