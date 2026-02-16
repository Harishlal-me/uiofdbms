# CampusSafe Lost & Found System

A comprehensive web-based lost and found management system designed for SRM Institute of Science and Technology, Kattankulathur Campus. The platform streamlines the process of reporting, matching, and claiming lost items through intelligent automation and administrative oversight.

## 🎯 Overview

CampusSafe is a full-stack application that connects students who have lost items with those who have found them. The system uses intelligent text-based matching algorithms to automatically identify potential matches and provides a complete workflow from report submission to item handover verification.

## ✨ Key Features

### For Students
- **Report Lost Items**: Submit detailed reports with photos, descriptions, and location information
- **Report Found Items**: Register found items with storage location tracking
- **Smart Matching**: Automatic matching system with confidence scores (40-95%)
- **My Matches**: View and claim matched items
- **Item Claims**: Submit proof photos and claim descriptions
- **CS Credits System**: Earn credits for helping others (10 credits per successful return)
- **Real-time Notifications**: Stay updated on match status and claims

### For Administrators
- **Verification Queue**: Review and validate AI-generated matches with confidence-based filtering
  - High Confidence (>80%)
  - Needs Review (30-79%)
  - Low Confidence (<30%)
- **Item Database**: Centralized registry of all reported items with advanced search
- **Claim Management**: Process item claims and verify handover
- **Condition Reporting**: Document item condition with photo verification
- **Case Reports**: Generate professional PDF reports for resolved cases
- **Storage Management**: Track item storage locations
- **User Management**: Manage student and admin accounts
- **Analytics Dashboard**: Monitor system statistics and performance
- **Audit Logs**: Complete activity tracking for accountability

## 🏗️ System Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS with modern design patterns
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **PDF Generation**: PDFKit
- **Environment**: dotenv

### Database Schema
- **Users**: Student and admin account management
- **LostReports**: Lost item submissions
- **FoundReports**: Found item submissions with storage tracking
- **Matches**: AI-generated item matches with confidence scores
- **ItemClaims**: Claim submissions with proof
- **ItemConditionReport**: Handover verification and condition tracking
- **Categories**: Item categorization
- **Locations**: Campus location mapping
- **StorageLocations**: Physical storage tracking
- **Notifications**: User notification system
- **AuditLogs**: System activity tracking

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd uiux
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lost_found_system_2028
JWT_SECRET=your_jwt_secret_key
```

4. **Set up the database**
```bash
# Create the database
mysql -u root -p
CREATE DATABASE lost_found_system_2028;

# Import the schema (if schema.sql is provided)
mysql -u root -p lost_found_system_2028 < schema.sql
```

5. **Start the application**

```bash
# Terminal 1: Start backend server
cd backend
node server.js

# Terminal 2: Start frontend development server
cd ..
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
uiux/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── userController.js     # Auth & user management
│   │   ├── lostController.js     # Lost reports
│   │   ├── foundController.js    # Found reports
│   │   ├── matchController.js    # Match management
│   │   ├── claimController.js    # Claim processing
│   │   ├── dashboardController.js # Analytics
│   │   └── adminReportController.js # PDF reports
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── lostRoutes.js
│   │   ├── foundRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── claimRoutes.js
│   │   └── adminReportRoutes.js
│   ├── uploads/                  # User-uploaded images
│   ├── .env                      # Environment variables
│   └── server.js                 # Express server entry point
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppLayout.jsx     # Main layout wrapper
│   │   └── ui/
│   │       └── Primitives.jsx    # Reusable UI components
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── VerificationQueue.jsx
│   │   │   ├── ItemDatabase.jsx
│   │   │   ├── ClaimHandover.jsx
│   │   │   └── AdminReports.jsx
│   │   ├── user/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReportLost.jsx
│   │   │   ├── ReportFound.jsx
│   │   │   ├── MyMatches.jsx
│   │   │   └── CSCredits.jsx
│   │   └── public/
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── services/
│   │   └── api.js                # Axios configuration
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # React entry point
└── README.md
```

## 🔐 Authentication & Authorization

### User Roles
- **Student**: Can report lost/found items, view matches, submit claims
- **Admin**: Full system access including verification, user management, and reporting

### Authentication Flow
1. User registers with email, password, and RA registration number
2. Password is hashed using bcrypt (10 salt rounds)
3. Login generates JWT token (7-day expiration)
4. Token is stored in localStorage and sent with each API request
5. Backend middleware validates token and attaches user info to requests

## 🤖 Intelligent Matching Algorithm

### How It Works
1. **Text Normalization**: Clean and standardize descriptions
2. **Tokenization**: Split text into meaningful words
3. **Jaccard Similarity**: Calculate word overlap between lost and found items
4. **Confidence Boosting**: Scores >10% are boosted by +50 (max 95%)
5. **Threshold Filtering**: Only matches ≥40% confidence are created

### Confidence Levels
- **High (>80%)**: Very likely match, minimal review needed
- **Medium (30-79%)**: Requires admin verification
- **Low (<30%)**: Filtered out, not shown

## 📊 CS Credits System

### How Credits Work
- **Finder Reward**: 10 credits when their found item is successfully claimed
- **Owner Reward**: Currently disabled (can be enabled)
- **Credit Tracking**: Real-time updates on user dashboard
- **Leaderboard**: Top contributors recognized

## 📄 PDF Report Generation

### Report Features
- **Professional Format**: SRM branding with institutional header
- **Comprehensive Sections**:
  - Case Information (ID, status, dates)
  - Item Details (lost/found descriptions)
  - Process Timeline (7-step workflow)
  - Claim & Handover Details
  - Photo Verification (finder + owner photos)
  - Condition Check (damage detection)
  - System Summary (auto-generated)
- **Institutional Footer**: Disclaimer and signature waiver

## 🛠️ API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Lost Items
- `POST /api/lost` - Create lost report
- `GET /api/lost` - Get all lost reports
- `GET /api/lost/user` - Get user's lost reports

### Found Items
- `POST /api/found` - Create found report
- `GET /api/found` - Get all found reports
- `GET /api/found/user` - Get user's found reports

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/user` - Get user's matches
- `PUT /api/matches/:id/verify` - Verify match (admin)

### Claims
- `POST /api/claims` - Submit item claim
- `GET /api/claims` - Get all claims (admin)
- `PUT /api/claims/:id/approve` - Approve claim (admin)

### Reports
- `GET /api/admin/reports/resolved` - Get resolved cases
- `GET /api/admin/reports/download/:id` - Download PDF report

## 🐛 Error Handling

### Comprehensive Error Logging
- **Request Logging**: All incoming requests logged with user, body, and files
- **Validation Errors**: Clear messages for missing required fields
- **SQL Errors**: Detailed error states and messages logged
- **User-Friendly Responses**: Generic errors in production, detailed in development

### Common Issues & Solutions
- **Port Conflicts**: Ensure port 5000 is free for backend
- **Database Connection**: Verify MySQL is running and credentials are correct
- **Undefined Parameters**: All optional fields converted to null before DB insert
- **Column Name Errors**: Use `area_name as location_name` for location queries

## 🧪 Testing

### Manual Testing
```bash
# Test database connection
node backend/test-db-connection.js

# Test user registration
node test-register.js

# Test admin login
node backend/test-login.js

# List all items
node backend/list-items.js
```

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production` in .env
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure file upload limits
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

## 👥 User Roles & Permissions

### Student Capabilities
- Register and login
- Report lost items with photos
- Report found items with storage location
- View personal matches
- Submit claims with proof
- Track CS credits

### Admin Capabilities
- All student capabilities
- Verify matches
- Approve/reject claims
- Generate case reports
- Manage storage locations
- View system analytics
- Access audit logs
- Manage users

## 📈 Future Enhancements

- [ ] Email notifications
- [ ] SMS alerts for high-confidence matches
- [ ] Mobile app (React Native)
- [ ] QR code generation for items
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with campus security
- [ ] Automated item disposal workflow

## 🤝 Contributing

This is an academic project for SRM Institute of Science and Technology. For suggestions or improvements, please contact the development team.

## 📝 License

This project is developed for educational purposes at SRM Institute of Science and Technology.

## 👨‍💻 Development Team

Developed as part of the UI/UX and Database Management Systems course project.

## 🆘 Support

For technical issues or questions:
1. Check the error logs in the backend terminal
2. Review the browser console for frontend errors
3. Verify database connection and schema
4. Ensure all environment variables are set correctly

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Institution**: SRM Institute of Science and Technology, Kattankulathur Campus
