from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    hourly_rate = db.Column(db.Float, default=15.0)  # Default hourly rate
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with attendance records
    attendance_records = db.relationship('AttendanceRecord', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email or self.phone}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'phone': self.phone,
            'hourly_rate': self.hourly_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AttendanceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    entry_time = db.Column(db.DateTime, nullable=True)
    exit_time = db.Column(db.DateTime, nullable=True)
    total_minutes = db.Column(db.Integer, default=0)
    salary_earned = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<AttendanceRecord {self.user_id} - {self.date}>'

    def calculate_salary(self, hourly_rate):
        """Calculate salary based on 30-minute blocks"""
        if self.total_minutes <= 0:
            return 0.0
        
        # Calculate complete 30-minute blocks
        complete_blocks = self.total_minutes // 30
        salary = complete_blocks * (hourly_rate / 2)  # Half hour rate
        return round(salary, 2)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'total_minutes': self.total_minutes,
            'salary_earned': self.salary_earned,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
