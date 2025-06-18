# Attendance Tracking Application

## Overview
A comprehensive web application for employers and employees to track daily attendance with authentication, dashboard functionality, and detailed reporting.

## Features

### 🔐 Authentication System
- **Login Options**: Email or phone number authentication
- **Password Security**: Secure password hashing with Werkzeug
- **Session Management**: Persistent login sessions with Flask sessions
- **Registration**: New user registration with customizable hourly rates

### 🏠 Dashboard
- **Today's Status**: Real-time display of current date and work status
- **Mark Entry/Exit**: Simple buttons to record arrival and departure times
- **Time Tracking**: Automatic calculation of total work time
- **Salary Calculation**: Real-time earnings based on 30-minute blocks
- **Validation**: Prevents multiple entries or exits per day

### 📅 Attendance History
- **Complete Records**: List of all past attendance records
- **Detailed Information**: Entry time, exit time, total duration, and earnings for each day
- **Summary Statistics**: Total days worked, total hours, and total earnings
- **Responsive Design**: Mobile-friendly table/card layout

### ⚙️ Profile Management
- **User Information**: Display email/phone and account details
- **Hourly Rate**: Shows current hourly rate and calculation rules
- **Account Actions**: Secure logout functionality

### 💰 Salary Calculation Logic
- **30-Minute Blocks**: Salary calculated in complete 30-minute increments
- **Incomplete Blocks**: Time less than 30 minutes is not counted
- **Example**: 1 hour 25 minutes = 2 complete blocks = full hourly rate
- **Real-time Updates**: Earnings calculated automatically on exit

## Technical Stack

### Backend (Flask)
- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite for data persistence
- **Authentication**: Session-based with password hashing
- **API**: RESTful endpoints for all functionality
- **CORS**: Enabled for frontend-backend communication

### Frontend (React)
- **Framework**: React with React Router for navigation
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first design approach
- **State Management**: React hooks for local state

## Deployment URLs

### Production Application
- **Frontend**: https://kxiolbuj.manus.space
- **Backend API**: https://w5hni7copj5e.manus.space

### API Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User authentication
- `POST /api/logout` - User logout
- `GET /api/profile` - Get user profile
- `POST /api/attendance/mark-entry` - Mark entry time
- `POST /api/attendance/mark-exit` - Mark exit time
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/history` - Get attendance history

## Usage Instructions

### Getting Started
1. **Access the Application**: Visit https://kxiolbuj.manus.space
2. **Create Account**: Click "Register" tab and provide:
   - Email or phone number (at least one required)
   - Password
   - Hourly rate (default: $15/hour)
3. **Login**: Use your email/phone and password to sign in

### Daily Attendance
1. **Mark Entry**: Click "Mark Entry" when you arrive at work
2. **Mark Exit**: Click "Mark Exit" when you leave work
3. **View Summary**: See today's total time and earnings on the dashboard

### Viewing History
1. **Navigate**: Click "History" button in the header
2. **Review Records**: View all past attendance records
3. **Check Totals**: See summary statistics at the top

### Profile Management
1. **Access Profile**: Click "Profile" button in the header
2. **View Details**: See your account information and hourly rate
3. **Logout**: Use the logout button when finished

## Mobile Responsiveness
- **Touch-Friendly**: Large buttons optimized for mobile devices
- **Responsive Layout**: Adapts to different screen sizes
- **Card Design**: Clean, mobile-first interface
- **Navigation**: Easy-to-use mobile navigation

## Security Features
- **Password Hashing**: Secure password storage
- **Session Management**: Secure user sessions
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Proper cross-origin request handling

## Data Validation
- **Duplicate Prevention**: Cannot mark multiple entries/exits per day
- **Time Validation**: Ensures logical entry/exit sequence
- **Input Sanitization**: All user inputs are validated and sanitized

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## Support
For technical support or questions about the application, please refer to the source code or contact the development team.

## License
This application is provided as-is for demonstration purposes.

