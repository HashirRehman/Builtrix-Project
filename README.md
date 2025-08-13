# 🏢 Builtrix Energy Dashboard

A comprehensive full-stack web application for monitoring and analyzing energy consumption across multiple buildings. Built with React, Node.js, Express, and PostgreSQL, featuring real-time data visualization, interactive charts, and advanced filtering capabilities.

## 🌟 Features

### 📊 **Interactive Dashboard**
- **Real-time Energy Monitoring**: Track energy consumption across 15+ buildings
- **Multi-level Data Visualization**: Monthly, daily, and 15-minute interval charts
- **Interactive Charts**: Click to drill down from monthly → daily → hourly data
- **Map Integration**: Geographic visualization of building locations with consumption data

### 🔍 **Advanced Filtering & Analysis**
- **Smart Building Search**: Autocomplete search with building filtering
- **Date Range Selection**: Flexible filtering by year, month, and day
- **Quick Preset Filters**: Last month, quarter, and year shortcuts
- **Real-time Filter Updates**: Instant chart updates based on selected criteria

### 📥 **Data Export Capabilities**
- **Multiple Export Formats**: CSV and JSON support
- **Flexible Export Options**: Current view, building-specific, or complete datasets
- **Batch Processing**: Export large datasets with progress indicators
- **Metadata Export**: Building information and geolocation data

### 🔐 **Authentication & Security**
- **JWT Authentication**: Secure login/registration system
- **Protected Routes**: Role-based access control
- **Password Security**: Bcrypt hashing with configurable rounds
- **Session Management**: Automatic token refresh and logout

### 🎨 **Modern UI/UX**
- **Professional Design**: Gradient backgrounds, smooth animations, and modern styling
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Skeleton screens and progressive loading
- **Toast Notifications**: User feedback for actions and errors
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### ⚡ **Performance Optimizations**
- **Lazy Loading**: Code splitting and dynamic imports
- **Data Caching**: Efficient API response caching
- **Image Optimization**: Compressed assets and responsive images
- **Bundle Optimization**: Tree shaking and minification

## 📁 Project Structure

```
builtrix-challenge/
├── backend/                     # Node.js Express API Server
│   ├── src/
│   │   ├── controllers/         # API route handlers
│   │   │   ├── authController.js
│   │   │   └── dataController.js
│   │   ├── db/                  # Database configuration
│   │   │   ├── index.js         # PostgreSQL connection
│   │   │   ├── init.js          # Database initialization
│   │   │   └── schema.sql       # Database schema
│   │   ├── middleware/          # Express middleware
│   │   │   ├── auth.js          # JWT authentication
│   │   │   └── errorHandler.js  # Error handling
│   │   ├── routes/              # API routes
│   │   │   ├── auth.js          # Authentication routes
│   │   │   └── api.js           # Data API routes
│   │   ├── utils/               # Utility functions
│   │   │   └── importData.js    # Data import scripts
│   │   └── server.js            # Main server file
│   ├── data/                    # Raw data files (1.5M+ records)
│   │   ├── energy_source_breakdown.csv
│   │   ├── metadata.csv
│   │   └── smart_meter.csv
│   ├── package.json
│   └── .env.example
│
├── frontend/                    # React Web Application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── common/          # Reusable components
│   │   │   │   ├── AnimatedButton.js
│   │   │   │   ├── LoadingSkeleton.js
│   │   │   │   └── PageTransition.js
│   │   │   ├── widgets/         # Dashboard widgets
│   │   │   │   ├── MapWidget.js
│   │   │   │   ├── MonthlyChart.js
│   │   │   │   ├── DailyChart.js
│   │   │   │   ├── FifteenMinChart.js
│   │   │   │   ├── EnergySourceChart.js
│   │   │   │   ├── FilterPanel.js
│   │   │   │   └── DataExport.js
│   │   │   ├── Dashboard.js     # Main dashboard
│   │   │   ├── Login.js         # Authentication
│   │   │   ├── Profile.js       # User profile
│   │   │   ├── Layout.js        # App layout
│   │   │   └── Header.js        # Navigation header
│   │   ├── context/             # React context providers
│   │   │   ├── AuthContext.js   # Authentication state
│   │   │   └── NotificationContext.js # Toast notifications
│   │   ├── services/            # API services
│   │   │   └── authService.js   # Authentication API calls
│   │   ├── App.js               # Main App component
│   │   └── index.js             # React entry point
│   ├── package.json
│   └── .env.example
│
├── README.md                    # This file
└── .gitignore
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download PostgreSQL](https://postgresql.org/download/)
- **Git** - [Download Git](https://git-scm.com/downloads)

### 1. Clone the Repository

```bash
git clone https://github.com/HashirRehman/Builtrix-Project.git
cd Builtrix-Project
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL (replace 'username' with your PostgreSQL username)
psql -U username -h localhost

# Create database and user
CREATE DATABASE builtrix_energy_db;
CREATE USER builtrix_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE builtrix_energy_db TO builtrix_user;
\q
```

#### Configure Database Connection

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=builtrix_energy_db
DB_USER=builtrix_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_at_least_32_characters_long
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

The backend server will:
- ✅ Initialize the PostgreSQL database with schema and indexes
- ✅ Import 1.5M+ energy consumption records automatically
- ✅ Create a default admin user (admin@builtrix.tech / admin123)
- ✅ Start the API server on http://localhost:5000

**Backend Features:**
- RESTful API with comprehensive endpoints
- JWT authentication with secure password hashing
- Automatic database initialization and data import
- API documentation available at http://localhost:5000/docs

### 4. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will:
- ✅ Start the React development server on http://localhost:3000
- ✅ Open automatically in your default browser
- ✅ Connect to the backend API
- ✅ Enable hot-reload for development

## 🔑 Default Login Credentials

```
Email: admin@builtrix.tech
Password: admin123
```

## 📊 Data Overview

The application includes comprehensive energy data:

- **📈 Smart Meter Data**: 1.5+ million records of 15-minute interval readings
- **🏢 Building Metadata**: 15 buildings with geolocation and property details
- **⚡ Energy Source Breakdown**: Renewable vs non-renewable energy composition
- **📅 Time Range**: Complete year 2021 data with detailed timestamps
- **🌍 Geographic Coverage**: Buildings across different locations with lat/lon coordinates

## 🛠️ Development

### Available Scripts

#### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-restart)
npm run import     # Import data manually
npm test           # Run tests
```

#### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### API Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires auth)
- `POST /auth/logout` - User logout (requires auth)

#### Data APIs
- `GET /api/metadata` - Get building metadata
- `GET /api/energy/monthly` - Monthly consumption data
- `GET /api/energy/daily` - Daily consumption data
- `GET /api/energy/15min` - 15-minute interval data
- `GET /api/energy/sources` - Energy source breakdown
- `GET /api/export` - Export data (CSV/JSON)

#### System
- `GET /health` - Health check
- `GET /docs` - API documentation

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development|production
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=builtrix_energy_db
DB_USER=builtrix_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development
```

## 🏗️ Architecture

### Backend Architecture
- **Framework**: Express.js with ES6 modules
- **Database**: PostgreSQL with optimized indexes
- **Authentication**: JWT with bcrypt password hashing
- **Security**: CORS, helmet, rate limiting
- **Error Handling**: Centralized error handling middleware
- **Logging**: Request/response logging with morgan

### Frontend Architecture
- **Framework**: React 18 with hooks and context
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context for global state
- **Charts**: Recharts for interactive data visualization
- **Styling**: CSS Modules with modern CSS features
- **Components**: Modular, reusable component architecture

### Database Schema
```sql
-- Buildings metadata with geolocation
metadata (cpe, lat, lon, totalarea, name, fulladdress)

-- Smart meter readings (1.5M+ records)
smart_meter (id, cpe, timestamp, active_energy)

-- Energy source breakdown
energy_source_breakdown (timestamp, renewable, nonrenewable, ...)

-- User authentication
users (id, email, password_hash, first_name, last_name, created_at)
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with configurable rounds
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against DDoS and brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check if port 5432 is available
netstat -an | grep 5432
```

#### Port Already in Use
```bash
# Kill process using port 5000
sudo kill -9 $(lsof -ti:5000)

# Kill process using port 3000
sudo kill -9 $(lsof -ti:3000)
```

#### Database Import Issues
```bash
# Manual data import
cd backend
node src/utils/importData.js
```

### Performance Tips

1. **Database Optimization**: Indexes are automatically created for optimal query performance
2. **Frontend Optimization**: Use `npm run build` for production-optimized builds
3. **Memory Usage**: Monitor Node.js memory usage for large datasets
4. **Network**: Enable compression for better API response times
