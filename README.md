# Hospital Appointment & Record Management System (MVP)

A comprehensive web-based hospital management system that enables patients to book appointments, doctors to manage schedules and medical records, and admins to oversee hospital operations.

## 🚀 Features

### Patient Features
- Register and login securely
- Browse doctors by department and specialization
- Book, view, and cancel appointments
- Access medical records and treatment history
- Receive email notifications for appointments

### Doctor Features
- Manage daily appointment schedules
- View patient information
- Create and update medical records
- Track consultation history

### Admin Features
- Dashboard with hospital statistics
- Manage doctors and departments
- Monitor all appointments
- View system-wide analytics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - API calls
- **Lucide React** - Icons
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone or Download the Project

```bash
cd "C:\Users\SAIF SANADI\Desktop\Hospital MGMT"
```

### 2. Database Setup

1. Open MySQL and create the database:

```bash
mysql -u root -p
```

2. Run the database schema:

```sql
source backend/config/database.sql
```

Or manually execute the SQL file in MySQL Workbench.

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management

JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Hospital Management <your_email@gmail.com>
```

**Note for Gmail SMTP:**
- Enable 2-factor authentication in your Google account
- Generate an App Password: Google Account → Security → 2-Step Verification → App Passwords
- Use the generated app password in `EMAIL_PASSWORD`

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📱 Usage

### First Time Setup

1. **Create Admin Account:**
   - Register with role "Patient" or "Doctor"
   - Manually update the role to "admin" in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
   ```

2. **Register Doctors:**
   - Doctors can self-register with their credentials
   - Admin can verify and manage doctor profiles

3. **Patient Registration:**
   - Patients can register directly from the website
   - Fill in medical information during registration

### Booking an Appointment

1. Login as a patient
2. Navigate to "Find Doctors"
3. Filter by department or specialization
4. Click "Book Appointment" on desired doctor
5. Select date, time, and reason
6. Submit booking

### Managing Appointments (Doctor)

1. Login as a doctor
2. View today's appointments on dashboard
3. Update appointment status (Confirmed/Completed/Cancelled)
4. Add notes for each appointment

### Creating Medical Records (Doctor)

1. Navigate to "Medical Records"
2. Click "Create New Record"
3. Select patient and appointment
4. Add diagnosis, prescription, and treatment details
5. Save record

## 🗂️ Project Structure

```
Hospital MGMT/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── database.sql
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── appointmentController.js
│   │   ├── doctorController.js
│   │   ├── medicalRecordController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   └── emailService.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── Navbar.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DoctorDashboard.js
│   │   │   ├── PatientDashboard.js
│   │   │   ├── Appointments.js
│   │   │   ├── Doctors.js
│   │   │   └── MedicalRecords.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment (Patient)
- `PUT /api/appointments/:id` - Update appointment (Doctor/Admin)
- `DELETE /api/appointments/:id` - Delete appointment

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `GET /api/doctors/departments/list` - Get all departments
- `PUT /api/doctors/:id` - Update doctor (Admin/Doctor)
- `DELETE /api/doctors/:id` - Delete doctor (Admin)

### Medical Records
- `GET /api/medical-records` - Get all records
- `GET /api/medical-records/:id` - Get single record
- `POST /api/medical-records` - Create record (Doctor)
- `PUT /api/medical-records/:id` - Update record (Doctor)
- `DELETE /api/medical-records/:id` - Delete record (Doctor/Admin)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard stats
- `GET /api/dashboard/doctor` - Doctor dashboard stats
- `GET /api/dashboard/patient` - Patient dashboard stats

## 🧪 Testing

Use Postman or any API testing tool to test the endpoints.

Import the following base URL:
```
http://localhost:5000/api
```

## 🚀 Deployment

### Backend (Render/Heroku)
1. Create account on Render.com
2. Create new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

### Frontend (Vercel/Netlify)
1. Create account on Vercel.com
2. Import project from Git
3. Configure build settings
4. Deploy

## 🔮 Future Enhancements

- AI-based doctor recommendations
- Online payment integration (Razorpay/Stripe)
- Mobile app (React Native)
- Real-time chat between doctor and patient
- Video consultation feature
- Cloud file storage for medical reports
- Calendar integration (Google Calendar)
- SMS notifications
- Multi-language support

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please create an issue in the repository.

## 🎯 MVP Completion Checklist

- ✅ User Authentication (JWT)
- ✅ Role-based Access Control
- ✅ Appointment Booking System
- ✅ Doctor Management
- ✅ Medical Records Module
- ✅ Role-based Dashboards
- ✅ Email Notifications
- ✅ Responsive UI Design
- ✅ MySQL Database Integration
- ✅ RESTful API Architecture

---

**Built with ❤️ for better healthcare management**
