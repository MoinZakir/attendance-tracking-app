from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    phone = db.Column(db.String(20), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='worker')  # 'admin' or 'worker'
    
    # Worker-specific fields
    daily_wage = db.Column(db.Float, nullable=True)  # Daily wage in rupees
    standard_hours = db.Column(db.Float, nullable=True, default=8.0)  # Standard working hours per day
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Admin relationship - which admin manages this worker
    admin_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    managed_workers = db.relationship('User', backref=db.backref('admin', remote_side=[id]))
    
    # Relationships
    attendance_records = db.relationship('AttendanceRecord', backref='user', lazy=True, cascade='all, delete-orphan')
    extra_payments = db.relationship('ExtraPayment', foreign_keys='ExtraPayment.user_id', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'daily_wage': self.daily_wage,
            'standard_hours': self.standard_hours,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'admin_id': self.admin_id
        }

class AttendanceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    entry_time = db.Column(db.DateTime, nullable=True)
    exit_time = db.Column(db.DateTime, nullable=True)
    total_hours = db.Column(db.Float, nullable=True)
    daily_earning = db.Column(db.Float, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def calculate_earnings(self):
        """Calculate daily earnings based on hours worked and daily wage"""
        if self.total_hours and self.user.daily_wage and self.user.standard_hours:
            # Calculate hourly rate
            hourly_rate = self.user.daily_wage / self.user.standard_hours
            # Calculate earnings based on actual hours worked
            self.daily_earning = self.total_hours * hourly_rate
        return self.daily_earning

    def __repr__(self):
        return f'<AttendanceRecord {self.user.username} - {self.date}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username,
            'date': self.date.isoformat() if self.date else None,
            'entry_time': self.entry_time.isoformat() if self.entry_time else None,
            'exit_time': self.exit_time.isoformat() if self.exit_time else None,
            'total_hours': self.total_hours,
            'daily_earning': self.daily_earning,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class ExtraPayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    reason = db.Column(db.String(255), nullable=False)
    payment_type = db.Column(db.String(50), nullable=False)  # 'bonus', 'overtime', 'deduction', 'advance'
    date = db.Column(db.Date, nullable=False)
    added_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Admin who added this
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    admin = db.relationship('User', foreign_keys=[added_by], backref='added_payments')

    def __repr__(self):
        return f'<ExtraPayment {self.user.username} - {self.amount}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username,
            'amount': self.amount,
            'reason': self.reason,
            'payment_type': self.payment_type,
            'date': self.date.isoformat() if self.date else None,
            'added_by': self.added_by,
            'admin_name': self.admin.username if self.admin else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class WeeklyReport(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    week_start = db.Column(db.Date, nullable=False)
    week_end = db.Column(db.Date, nullable=False)
    total_hours = db.Column(db.Float, nullable=False)
    total_earnings = db.Column(db.Float, nullable=False)
    extra_payments = db.Column(db.Float, nullable=False, default=0.0)
    final_amount = db.Column(db.Float, nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    generated_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    user = db.relationship('User', foreign_keys=[user_id], backref='weekly_reports')
    admin = db.relationship('User', foreign_keys=[generated_by], backref='generated_reports')

    def __repr__(self):
        return f'<WeeklyReport {self.user.username} - {self.week_start} to {self.week_end}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'username': self.user.username,
            'week_start': self.week_start.isoformat() if self.week_start else None,
            'week_end': self.week_end.isoformat() if self.week_end else None,
            'total_hours': self.total_hours,
            'total_earnings': self.total_earnings,
            'extra_payments': self.extra_payments,
            'final_amount': self.final_amount,
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'generated_by': self.generated_by,
            'admin_name': self.admin.username if self.admin else None
        }
