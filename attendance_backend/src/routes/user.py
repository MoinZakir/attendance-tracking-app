from flask import Blueprint, jsonify, request, session
from src.models.user import User, AttendanceRecord, db
from datetime import datetime, date
import re

user_bp = Blueprint('user', __name__)

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    # Simple phone validation - adjust as needed
    pattern = r'^\+?[\d\s\-\(\)]{10,}$'
    return re.match(pattern, phone) is not None

@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        hourly_rate = data.get('hourly_rate', 15.0)

        # Validate input
        if not password:
            return jsonify({'error': 'Password is required'}), 400

        if not email and not phone:
            return jsonify({'error': 'Either email or phone is required'}), 400

        if email and not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        if phone and not validate_phone(phone):
            return jsonify({'error': 'Invalid phone format'}), 400

        # Check if user already exists
        existing_user = None
        if email:
            existing_user = User.query.filter_by(email=email).first()
        if not existing_user and phone:
            existing_user = User.query.filter_by(phone=phone).first()

        if existing_user:
            return jsonify({'error': 'User already exists'}), 400

        # Create new user
        user = User(email=email, phone=phone, hourly_rate=hourly_rate)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        identifier = data.get('identifier')  # email or phone
        password = data.get('password')

        if not identifier or not password:
            return jsonify({'error': 'Identifier and password are required'}), 400

        # Find user by email or phone
        user = None
        if validate_email(identifier):
            user = User.query.filter_by(email=identifier).first()
        else:
            user = User.query.filter_by(phone=identifier).first()

        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Store user session
        session['user_id'] = user.id
        session['logged_in'] = True

        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict()), 200

@user_bp.route('/attendance/mark-entry', methods=['POST'])
def mark_entry():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    try:
        user_id = session['user_id']
        today = date.today()
        now = datetime.now()

        # Check if entry already exists for today
        existing_record = AttendanceRecord.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()

        if existing_record and existing_record.entry_time:
            return jsonify({'error': 'Entry already marked for today'}), 400

        if existing_record:
            # Update existing record
            existing_record.entry_time = now
            existing_record.updated_at = now
        else:
            # Create new record
            existing_record = AttendanceRecord(
                user_id=user_id,
                date=today,
                entry_time=now
            )
            db.session.add(existing_record)

        db.session.commit()

        return jsonify({
            'message': 'Entry marked successfully',
            'record': existing_record.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/attendance/mark-exit', methods=['POST'])
def mark_exit():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    try:
        user_id = session['user_id']
        today = date.today()
        now = datetime.now()

        # Find today's record
        record = AttendanceRecord.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()

        if not record or not record.entry_time:
            return jsonify({'error': 'No entry found for today'}), 400

        if record.exit_time:
            return jsonify({'error': 'Exit already marked for today'}), 400

        # Calculate total time
        time_diff = now - record.entry_time
        total_minutes = int(time_diff.total_seconds() / 60)

        # Get user's hourly rate
        user = User.query.get(user_id)
        salary_earned = record.calculate_salary(user.hourly_rate)

        # Update record
        record.exit_time = now
        record.total_minutes = total_minutes
        record.salary_earned = salary_earned
        record.updated_at = now

        db.session.commit()

        return jsonify({
            'message': 'Exit marked successfully',
            'record': record.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/attendance/today', methods=['GET'])
def get_today_attendance():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    try:
        user_id = session['user_id']
        today = date.today()

        record = AttendanceRecord.query.filter_by(
            user_id=user_id, 
            date=today
        ).first()

        if not record:
            return jsonify({
                'date': today.isoformat(),
                'entry_time': None,
                'exit_time': None,
                'total_minutes': 0,
                'salary_earned': 0.0
            }), 200

        return jsonify(record.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/attendance/history', methods=['GET'])
def get_attendance_history():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    try:
        user_id = session['user_id']
        
        records = AttendanceRecord.query.filter_by(user_id=user_id)\
                                       .order_by(AttendanceRecord.date.desc())\
                                       .all()

        return jsonify([record.to_dict() for record in records]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
