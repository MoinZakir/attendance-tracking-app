from flask import Blueprint, jsonify, request, session
from src.models.user import User, AttendanceRecord, ExtraPayment, WeeklyReport, db
from datetime import datetime, date, timedelta
from functools import wraps
import calendar

user_bp = Blueprint('user', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Authentication endpoints
@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    existing_user = User.query.filter(
        (User.username == data['username']) |
        (User.email == data.get('email')) |
        (User.phone == data.get('phone'))
    ).first()
    
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data.get('email'),
        phone=data.get('phone'),
        role=data.get('role', 'worker'),
        daily_wage=data.get('daily_wage'),
        standard_hours=data.get('standard_hours', 8.0),
        admin_id=data.get('admin_id')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    login_field = data.get('login')  # Can be username, email, or phone
    password = data.get('password')
    
    # Find user by username, email, or phone
    user = User.query.filter(
        (User.username == login_field) |
        (User.email == login_field) |
        (User.phone == login_field)
    ).first()
    
    if user and user.check_password(password):
        session['user_id'] = user.id
        session['user_role'] = user.role
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict()
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@user_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'})

@user_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    user = User.query.get(session['user_id'])
    return jsonify(user.to_dict())

# Worker management endpoints (Admin only)
@user_bp.route('/workers', methods=['GET'])
@admin_required
def get_workers():
    admin_id = session['user_id']
    workers = User.query.filter_by(admin_id=admin_id, role='worker').all()
    return jsonify([worker.to_dict() for worker in workers])

@user_bp.route('/workers', methods=['POST'])
@admin_required
def create_worker():
    data = request.json
    admin_id = session['user_id']
    
    # Check if worker already exists
    existing_user = User.query.filter(
        (User.username == data['username']) |
        (User.email == data.get('email')) |
        (User.phone == data.get('phone'))
    ).first()
    
    if existing_user:
        return jsonify({'error': 'Worker already exists'}), 400
    
    # Create new worker
    worker = User(
        username=data['username'],
        email=data.get('email'),
        phone=data.get('phone'),
        role='worker',
        daily_wage=data['daily_wage'],
        standard_hours=data.get('standard_hours', 8.0),
        admin_id=admin_id
    )
    worker.set_password(data['password'])
    
    db.session.add(worker)
    db.session.commit()
    
    return jsonify(worker.to_dict()), 201

@user_bp.route('/workers/<int:worker_id>', methods=['PUT'])
@admin_required
def update_worker(worker_id):
    admin_id = session['user_id']
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    data = request.json
    worker.username = data.get('username', worker.username)
    worker.email = data.get('email', worker.email)
    worker.phone = data.get('phone', worker.phone)
    worker.daily_wage = data.get('daily_wage', worker.daily_wage)
    worker.standard_hours = data.get('standard_hours', worker.standard_hours)
    worker.is_active = data.get('is_active', worker.is_active)
    
    if 'password' in data:
        worker.set_password(data['password'])
    
    db.session.commit()
    return jsonify(worker.to_dict())

@user_bp.route('/workers/<int:worker_id>', methods=['DELETE'])
@admin_required
def delete_worker(worker_id):
    admin_id = session['user_id']
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    db.session.delete(worker)
    db.session.commit()
    return '', 204

# Attendance endpoints
@user_bp.route('/attendance/mark-entry', methods=['POST'])
@login_required
def mark_entry():
    user_id = session['user_id']
    today = date.today()
    
    # Check if entry already marked today
    existing_record = AttendanceRecord.query.filter_by(
        user_id=user_id, 
        date=today
    ).first()
    
    if existing_record and existing_record.entry_time:
        return jsonify({'error': 'Entry already marked for today'}), 400
    
    # Create or update attendance record
    if existing_record:
        existing_record.entry_time = datetime.now()
    else:
        record = AttendanceRecord(
            user_id=user_id,
            date=today,
            entry_time=datetime.now()
        )
        db.session.add(record)
    
    db.session.commit()
    
    record = AttendanceRecord.query.filter_by(user_id=user_id, date=today).first()
    return jsonify({
        'message': 'Entry marked successfully',
        'record': record.to_dict()
    })

@user_bp.route('/attendance/mark-exit', methods=['POST'])
@login_required
def mark_exit():
    user_id = session['user_id']
    today = date.today()
    
    # Get today's attendance record
    record = AttendanceRecord.query.filter_by(
        user_id=user_id, 
        date=today
    ).first()
    
    if not record or not record.entry_time:
        return jsonify({'error': 'Please mark entry first'}), 400
    
    if record.exit_time:
        return jsonify({'error': 'Exit already marked for today'}), 400
    
    # Mark exit and calculate hours
    record.exit_time = datetime.now()
    
    # Calculate total hours
    time_diff = record.exit_time - record.entry_time
    record.total_hours = round(time_diff.total_seconds() / 3600, 2)
    
    # Calculate earnings
    record.calculate_earnings()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Exit marked successfully',
        'record': record.to_dict()
    })

@user_bp.route('/attendance/today', methods=['GET'])
@login_required
def get_today_attendance():
    user_id = session['user_id']
    today = date.today()
    
    record = AttendanceRecord.query.filter_by(
        user_id=user_id, 
        date=today
    ).first()
    
    if record:
        return jsonify(record.to_dict())
    else:
        return jsonify(None)

@user_bp.route('/attendance/history', methods=['GET'])
@login_required
def get_attendance_history():
    user_id = session['user_id']
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 30, type=int)
    
    records = AttendanceRecord.query.filter_by(user_id=user_id)\
        .order_by(AttendanceRecord.date.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'records': [record.to_dict() for record in records.items],
        'total': records.total,
        'pages': records.pages,
        'current_page': page
    })

# Admin dashboard endpoints
@user_bp.route('/admin/dashboard', methods=['GET'])
@admin_required
def admin_dashboard():
    admin_id = session['user_id']
    today = date.today()
    
    # Get all workers under this admin
    workers = User.query.filter_by(admin_id=admin_id, role='worker').all()
    worker_ids = [w.id for w in workers]
    
    # Today's attendance summary
    today_records = AttendanceRecord.query.filter(
        AttendanceRecord.user_id.in_(worker_ids),
        AttendanceRecord.date == today
    ).all()
    
    # This week's summary
    week_start = today - timedelta(days=today.weekday())
    week_records = AttendanceRecord.query.filter(
        AttendanceRecord.user_id.in_(worker_ids),
        AttendanceRecord.date >= week_start,
        AttendanceRecord.date <= today
    ).all()
    
    # This month's summary
    month_start = today.replace(day=1)
    month_records = AttendanceRecord.query.filter(
        AttendanceRecord.user_id.in_(worker_ids),
        AttendanceRecord.date >= month_start,
        AttendanceRecord.date <= today
    ).all()
    
    return jsonify({
        'total_workers': len(workers),
        'today': {
            'present': len([r for r in today_records if r.entry_time]),
            'completed': len([r for r in today_records if r.exit_time]),
            'total_hours': sum([r.total_hours or 0 for r in today_records]),
            'total_earnings': sum([r.daily_earning or 0 for r in today_records])
        },
        'this_week': {
            'total_hours': sum([r.total_hours or 0 for r in week_records]),
            'total_earnings': sum([r.daily_earning or 0 for r in week_records])
        },
        'this_month': {
            'total_hours': sum([r.total_hours or 0 for r in month_records]),
            'total_earnings': sum([r.daily_earning or 0 for r in month_records])
        },
        'workers': [w.to_dict() for w in workers]
    })

@user_bp.route('/admin/workers/<int:worker_id>/attendance', methods=['GET'])
@admin_required
def get_worker_attendance(worker_id):
    admin_id = session['user_id']
    
    # Verify worker belongs to this admin
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    # Get date range from query params
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = AttendanceRecord.query.filter_by(user_id=worker_id)
    
    if start_date:
        query = query.filter(AttendanceRecord.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(AttendanceRecord.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    records = query.order_by(AttendanceRecord.date.desc()).all()
    
    return jsonify({
        'worker': worker.to_dict(),
        'records': [record.to_dict() for record in records],
        'summary': {
            'total_hours': sum([r.total_hours or 0 for r in records]),
            'total_earnings': sum([r.daily_earning or 0 for r in records]),
            'total_days': len(records)
        }
    })

# Extra payments endpoints
@user_bp.route('/admin/workers/<int:worker_id>/extra-payments', methods=['POST'])
@admin_required
def add_extra_payment(worker_id):
    admin_id = session['user_id']
    
    # Verify worker belongs to this admin
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    data = request.json
    payment = ExtraPayment(
        user_id=worker_id,
        amount=data['amount'],
        reason=data['reason'],
        payment_type=data['payment_type'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        added_by=admin_id,
        notes=data.get('notes')
    )
    
    db.session.add(payment)
    db.session.commit()
    
    return jsonify(payment.to_dict()), 201

@user_bp.route('/admin/workers/<int:worker_id>/extra-payments', methods=['GET'])
@admin_required
def get_worker_extra_payments(worker_id):
    admin_id = session['user_id']
    
    # Verify worker belongs to this admin
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    payments = ExtraPayment.query.filter_by(user_id=worker_id)\
        .order_by(ExtraPayment.date.desc()).all()
    
    return jsonify([payment.to_dict() for payment in payments])

# Weekly report generation
@user_bp.route('/admin/workers/<int:worker_id>/weekly-report', methods=['POST'])
@admin_required
def generate_weekly_report(worker_id):
    admin_id = session['user_id']
    data = request.json
    
    # Verify worker belongs to this admin
    worker = User.query.filter_by(id=worker_id, admin_id=admin_id, role='worker').first()
    if not worker:
        return jsonify({'error': 'Worker not found'}), 404
    
    week_start = datetime.strptime(data['week_start'], '%Y-%m-%d').date()
    week_end = datetime.strptime(data['week_end'], '%Y-%m-%d').date()
    
    # Get attendance records for the week
    records = AttendanceRecord.query.filter(
        AttendanceRecord.user_id == worker_id,
        AttendanceRecord.date >= week_start,
        AttendanceRecord.date <= week_end
    ).all()
    
    # Get extra payments for the week
    extra_payments = ExtraPayment.query.filter(
        ExtraPayment.user_id == worker_id,
        ExtraPayment.date >= week_start,
        ExtraPayment.date <= week_end
    ).all()
    
    total_hours = sum([r.total_hours or 0 for r in records])
    total_earnings = sum([r.daily_earning or 0 for r in records])
    extra_amount = sum([p.amount for p in extra_payments])
    final_amount = total_earnings + extra_amount
    
    # Create weekly report
    report = WeeklyReport(
        user_id=worker_id,
        week_start=week_start,
        week_end=week_end,
        total_hours=total_hours,
        total_earnings=total_earnings,
        extra_payments=extra_amount,
        final_amount=final_amount,
        generated_by=admin_id
    )
    
    db.session.add(report)
    db.session.commit()
    
    return jsonify({
        'report': report.to_dict(),
        'attendance_records': [r.to_dict() for r in records],
        'extra_payments': [p.to_dict() for p in extra_payments]
    })
