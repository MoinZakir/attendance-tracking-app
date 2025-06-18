# Attendance Tracking Application

This is a responsive web application designed for employers and employees to track daily attendance, manage work hours, and calculate salaries based on recorded time.

## Features

### 🔐 Login Page
-   **Authentication Options:** Users can log in using either their email address or phone number.
-   **Secure Access:** Supports password-based authentication.

### 🏠 Dashboard
-   **Real-time Status:** Displays the current date and the user's attendance status for the day.
-   **Easy Actions:** Two prominent buttons for "Mark Entry" and "Mark Exit" to record attendance.
-   **Time Tracking:** Shows recorded entry and exit times.
-   **Auto-Calculation:** Automatically calculates the total time spent working.
-   **Salary Calculation:** Calculates salary earned based on a unique 30-minute block logic:
    -   Salary is divided into 30-minute blocks.
    -   If a user leaves before a 30-minute block is completed (e.g., after 26 or 29 minutes), that specific block is not counted towards the salary.

### 📅 Attendance History Page
-   **Comprehensive Records:** Lists all past attendance dates.
-   **Detailed View:** Each entry displays:
    -   Entry Time
    -   Exit Time
    -   Total Time Worked
    -   Salary Earned for that day

### ⚙️ Profile Section
-   **User Information:** Displays basic user details (email or phone number).
-   **Logout Option:** Securely log out from the application.

## Technical Stack

-   **Backend:** Flask (Python web framework) with SQLAlchemy for ORM and SQLite for the database.
-   **Frontend:** React.js (JavaScript library for building user interfaces) with Tailwind CSS for styling and shadcn/ui for UI components.
-   **Authentication:** Session-based authentication with password hashing for security.
-   **Deployment:** Designed for production deployment with CORS (Cross-Origin Resource Sharing) enabled for seamless frontend-backend communication.

## Getting Started

Follow these steps to set up and run the project locally for development or modification.

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Python 3.8+**
-   **Node.js 18+**
-   **pnpm** (recommended package manager for frontend, install via `npm install -g pnpm`)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/attendance-tracking-app.git
cd attendance-tracking-app
```

### 2. Backend Setup (Flask)

Navigate to the `attendance_backend` directory, create a virtual environment, install dependencies, and run the application.

```bash
cd attendance_backend
python3 -m venv venv
source venv/bin/activate  # On Windows, use `.\venv\Scripts\activate`
pip install -r requirements.txt
flask db upgrade # Initialize the database (if using Flask-Migrate)
python src/main.py
```

The backend server will typically run on `http://localhost:5001`.

### 3. Frontend Setup (React)

Open a new terminal, navigate to the `attendance_frontend` directory, install dependencies, and start the development server.

```bash
cd attendance_frontend
pnpm install
pnpm run dev
```

The frontend development server will typically run on `http://localhost:5173`.

### 4. Access the Application

Open your web browser and navigate to `http://localhost:5173` to access the application.

## Project Structure

```
attendance-tracking-app/
├── attendance_backend/             # Flask Backend
│   ├── src/
│   │   ├── main.py                 # Main Flask application file
│   │   ├── models/                 # Database models (e.g., user.py, attendance.py)
│   │   ├── routes/                 # API routes (e.g., user.py, attendance.py)
│   │   └── ...
│   ├── venv/                       # Python Virtual Environment
│   ├── requirements.txt            # Python dependencies
│   └── ...
├── attendance_frontend/            # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.jsx                 # Main React component and routing
│   │   ├── components/             # Reusable React components (Login, Dashboard, History, Profile)
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AttendanceHistory.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.css                 # Tailwind CSS styles
│   │   └── main.jsx                # React entry point
│   ├── index.html                  # HTML entry file
│   ├── package.json                # Node.js dependencies
│   ├── pnpm-lock.yaml
│   └── vite.config.js
├── README.md                       # Project README (this file)
├── PROJECT_SUMMARY.md              # Summary of the project and features
└── attendance_app_source.zip       # Zipped source code
```

## Modification and Development

### Backend (Flask)

-   **API Endpoints:** Modify files in `attendance_backend/src/routes/` to change or add API endpoints.
-   **Database Models:** Update `attendance_backend/src/models/` to modify existing database tables or add new ones. Remember to run Flask-Migrate commands (`flask db migrate`, `flask db upgrade`) after model changes.
-   **Business Logic:** Implement or adjust attendance and salary calculation logic in the backend routes.

### Frontend (React)

-   **Components:** Modify existing React components in `attendance_frontend/src/components/` or create new ones.
-   **Styling:** Adjust the Tailwind CSS classes in your JSX files or modify `attendance_frontend/src/App.css` for global styles.
-   **API Integration:** Ensure that frontend API calls in `src/components/*.jsx` match the backend API endpoints and the deployed backend URL.
-   **Routing:** Update `attendance_frontend/src/App.jsx` for any changes in application routes.

## Deployment

For production deployment, you will need to build the frontend and deploy both the frontend and backend to a hosting service.

### Building the Frontend for Production

```bash
cd attendance_frontend
pnpm run build
```

This will create a `dist` folder with optimized static assets ready for deployment.

### Hosting Suggestions

**For Frontend (Static Site Hosting):**
-   **Vercel:** Highly recommended for React apps due to its ease of use, generous free tier, and performance.
-   **Netlify:** Another excellent choice with similar features to Vercel.
-   **GitHub Pages:** Simple for basic static site hosting directly from your GitHub repository.

**For Backend (PaaS - Platform as a Service):**
-   **Render:** Offers a free tier for web services and is suitable for Flask applications.
-   **PythonAnywhere:** Provides a free plan specifically for Python web apps.
-   **Railway:** A newer option with a free tier that can work for small Flask projects.

**Important Note on Database for Free Tiers:**
For free-tier deployments, persisting the SQLite database might be challenging as many free services do not offer persistent storage for their free plans. You might consider migrating to a cloud-based database service (e.g., Supabase, PlanetScale, MongoDB Atlas - all have free tiers) and updating your Flask application to connect to it.

## Contributing

Feel free to fork this repository, make improvements, and submit pull requests.

## License

This project is open-source and available under the [MIT License](LICENSE). (You might want to create a LICENSE file in your repository)


