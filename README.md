# 🏭 Workshop Manager - Attendance Tracking System

## 🚀 Project Overview

This project delivers a comprehensive and visually enhanced attendance tracking and management system designed for workshops and small businesses. It automates daily wage calculations, provides real-time attendance monitoring, and offers robust reporting features, eliminating the need for manual payment calculations.

## 🎯 Problem Solved

Manual calculation of worker payments can be time-consuming and prone to errors. This application automates the entire process, saving hours of administrative work each month and providing accurate, real-time insights into workforce productivity and costs.

**Before**: 3-4 hours monthly calculating payments for 5 workers, manual tracking, prone to errors.
**After**: 5 minutes to generate complete payment reports, real-time monitoring, automatic calculations with 100% accuracy.

## ✨ Features Implemented

### 👨‍💼 Admin Features (For Workshop Owners/Managers)

- **Worker Management**: Add, edit, activate/deactivate workers with their daily wages and standard working hours.
- **Real-time Attendance Monitoring**: View all workers' daily attendance, entry/exit times, and current work status.
- **Payment Management**: Record extra payments (bonuses, overtime) and deductions with reasons, integrated into automatic calculations.
- **Comprehensive Reports**: Generate detailed reports by worker or time period, including total hours, days worked, and earnings. Export reports as CSV.
- **Dashboard Overview**: Quick statistics on total workers, today's attendance, and recent activities.

### 👷‍♂️ Worker Features (For Employees)

- **Simple Attendance Marking**: One-click 


entry and exit marking, preventing multiple entries/exits per day.
- **Personal Dashboard**: View today's work summary, entry/exit times, hours worked, and daily earnings.
- **Earnings Tracking**: Track daily, weekly, and monthly earnings, including bonus and extra payment history.

## 💰 Automatic Payment Calculation

- **Daily Wage System**: Each worker has a set daily wage (e.g., ₹400/day) and standard working hours (default: 8 hours).
- **Hourly Rate Calculation**: Hourly rate is derived from daily wage ÷ standard hours (e.g., ₹400 / 8 = ₹50/hour).
- **Dynamic Earnings**: Earnings are calculated based on actual hours worked, with automatic summation for weekly/monthly totals.

## 🎨 Enhanced Visual Design

This application has been transformed with a modern, vibrant, and visually appealing design, moving away from a plain, "white and boring" interface.

### Key Visual Enhancements:
- **Color Palette Transformation**: Utilizes beautiful gradient backgrounds and vibrant color schemes (deep purple-blue, soft coral-peach, teal-green).
- **Modern Card Design**: Features glass morphism effects, hover animations, gradient borders, and multi-layered shadows.
- **Interactive Elements**: All buttons and interactive components use beautiful gradients with smooth hover effects and animated loading states.
- **Typography & Layout**: Incorporates gradient text for important headings, improved spacing, and integrated Lucide icons for better visual hierarchy.
- **Dashboard Improvements**: Admin and Worker dashboards feature colorful stats cards, quick action buttons, and modern activity feeds.
- **Login Page Transformation**: Includes floating gradient orbs, glass-effect form fields, and professional branding.

## 🛠 Technical Stack

### Backend:
- **Framework**: Flask
- **Database**: SQLite (for simplicity, can be extended to PostgreSQL/MySQL for production)
- **ORM**: SQLAlchemy
- **Authentication**: Session-based with password hashing
- **API**: RESTful endpoints

### Frontend:
- **Framework**: React
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 🚀 Getting Started (Local Development)

To set up and run this project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/MoinZakir/attendance-tracking-app.git
cd attendance-tracking-app
```

### 2. Backend Setup

Navigate to the `attendance_backend` directory:

```bash
cd attendance_backend
```

Create a Python virtual environment and activate it:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Run database migrations (if any, though SQLite is file-based):

```bash
flask db upgrade # If using Flask-Migrate
```

Start the Flask backend server:

```bash
flask run
```

The backend will typically run on `http://127.0.0.1:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `attendance_frontend` directory:

```bash
cd ../attendance_frontend
```

Install the Node.js dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` (or another available port).

## 🌐 Hosting and Deployment

For public use, you will need to deploy both the frontend and backend components to a stable hosting solution.

### Frontend (React - Static Site Hosting)

**Recommended Services (Free/Free-Tier):**
- **Vercel**: Excellent for React apps, offers generous free tier, automatic deployments from Git, global CDN.
- **Netlify**: Similar to Vercel, great developer experience, continuous deployment, custom domains.
- **GitHub Pages**: Simple option if your project is hosted on GitHub, suitable for static sites.
- **Firebase Hosting**: Fast and secure hosting for static assets with a free tier.

**Deployment Steps (General for Vercel/Netlify):**
1. Build your React application for production:
   ```bash
   cd attendance_frontend
   npm run build
   ```
   This will create a `dist` folder with optimized static files.
2. Connect your GitHub repository to your chosen hosting service (Vercel/Netlify).
3. Configure the build command (e.g., `npm run build`) and the publish directory (e.g., `dist`).
4. Deploy! Your frontend will be live on a public URL.

### Backend (Flask - Backend as a Service / PaaS)

**Recommended Services (Free/Free-Tier for small projects):**
- **Render**: Offers a free tier for web services, supports Python/Flask, automatic deployments from Git.
- **Heroku**: Popular for Flask apps, but free tier has limitations (consider paid plans for consistent uptime).
- **PythonAnywhere**: Provides a free plan specifically for Python web applications, easy to set up.
- **Railway**: Offers a free tier with a monthly usage limit suitable for small Flask applications.

**Important Considerations for Backend Deployment:**
- **Database Persistence**: The current setup uses SQLite, which is file-based. For production deployments on most PaaS, you'll need a persistent database. Consider migrating to a cloud-based database service (e.g., PostgreSQL on Render/Heroku, or a free-tier managed database like Supabase, PlanetScale, or MongoDB Atlas) and updating your Flask application to connect to it.
- **Environment Variables**: Manage sensitive information (like database URLs, API keys) using environment variables on your hosting platform, not directly in the code.
- **CORS**: Ensure your backend is configured to allow Cross-Origin Resource Sharing (CORS) from your deployed frontend URL.

## 🤝 Contributing

Feel free to fork the repository, make improvements, and submit pull requests. Any contributions are welcome!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). 

---

**Your Workshop Manager now has a modern, professional appearance that your workers will love to use every day!** 🎉

