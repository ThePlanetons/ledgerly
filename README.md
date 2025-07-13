# Income Expense Tracker

A modern, mobile-first income and expense tracking application built with React TypeScript, Node.js, and PostgreSQL. Features a beautiful pastel color scheme and native-like mobile interface.

## Features

### ✨ Core Features
- **Dashboard**: Overview of current balance, recent transactions, and financial summary
- **Income Tracking**: Project-based income with settlement phases
- **Expense Tracking**: Categorized expenses with tags
- **Current Balance**: Real-time calculation of total income minus expenses
- **Charts & Analytics**: Visual representation of financial data
- **Mobile-First Design**: Optimized for mobile devices with pastel colors

### 📱 Mobile-First Design
- Bottom navigation for easy thumb navigation
- Floating action button for quick actions
- Responsive design that works on all screen sizes
- Smooth animations and transitions
- Native-like feel with backdrop blur effects

### 🎨 Design System
- Pastel color palette (pink, blue, green, yellow, purple, orange)
- Native HTML/CSS aesthetic
- Smooth animations and micro-interactions
- Glassmorphism effects with backdrop blur
- Consistent typography and spacing

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **CORS** for cross-origin requests
- **Helmet** for security
- **Morgan** for logging

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Chart.js** with react-chartjs-2 for charts
- **Lucide React** for icons
- **Axios** for API calls

## Project Structure

```
├── backend/
│   ├── routes/
│   │   ├── income.js
│   │   ├── expense.js
│   │   └── dashboard.js
│   ├── database.js
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navigation.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. **Install PostgreSQL** and create a database:
   ```sql
   CREATE DATABASE expense_tracker;
   ```

2. **Create a PostgreSQL user** (optional):
   ```sql
   CREATE USER expense_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;
   ```

3. **Update database credentials** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=expense_tracker
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   Or manually create `.env` with the provided configuration.

4. **Start the backend server**:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:5173`

## Data Models

### Income Table
- `id` (Serial Primary Key)
- `project_name` (String)
- `client_name` (String)
- `amount` (Decimal)
- `settlement_date` (Date)
- `settlement_phase` (String: Phase 1, Phase 2, Phase 3, Final Phase, Bonus)
- `source_person` (String)
- `payment_type` (String: Account, UPI, Google Pay, PhonePe, Paytm, Other)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Expense Table
- `id` (Serial Primary Key)
- `name` (String)
- `date` (Date)
- `amount` (Decimal)
- `expense_tag` (String: WiFi Bill, Electricity Bill, Maintenance, Lunch, etc.)
- `spent_person` (String)
- `payment_type` (String: Account, UPI, Google Pay, PhonePe, Paytm, Other)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## API Endpoints

### Income Endpoints
- `GET /api/income` - Get all income records
- `POST /api/income` - Create new income record
- `GET /api/income/:id` - Get income by ID
- `PUT /api/income/:id` - Update income record
- `DELETE /api/income/:id` - Delete income record
- `GET /api/income/stats/summary` - Get income statistics

### Expense Endpoints
- `GET /api/expense` - Get all expense records
- `POST /api/expense` - Create new expense record
- `GET /api/expense/:id` - Get expense by ID
- `PUT /api/expense/:id` - Update expense record
- `DELETE /api/expense/:id` - Delete expense record
- `GET /api/expense/stats/summary` - Get expense statistics
- `GET /api/expense/tag/:tag` - Get expenses by tag

### Dashboard Endpoints
- `GET /api/dashboard/balance` - Get current balance
- `GET /api/dashboard/summary` - Get comprehensive dashboard summary
- `GET /api/dashboard/monthly-data` - Get monthly data for charts
- `GET /api/dashboard/expense-breakdown` - Get expense breakdown by category
- `GET /api/dashboard/income-breakdown` - Get income breakdown by phase

## Development

### Running in Development Mode

1. **Start the backend**:
   ```bash
   cd backend && npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd frontend && npm run dev
   ```

### Building for Production

1. **Build the frontend**:
   ```bash
   cd frontend && npm run build
   ```

2. **Start the backend in production**:
   ```bash
   cd backend && npm start
   ```

## Features Roadmap

### Phase 1 (Current)
- ✅ Basic dashboard with balance display
- ✅ Income and expense API endpoints
- ✅ Mobile-first responsive design
- ✅ Pastel color scheme

### Phase 2 (Coming Soon)
- 🔄 Income and expense form modals
- 🔄 Transaction list views
- 🔄 Edit and delete functionality
- 🔄 Search and filter options

### Phase 3 (Future)
- 📅 Charts and analytics
- 📅 Export to CSV/PDF
- 📅 Recurring transactions
- 📅 Budget planning
- 📅 Notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Happy Tracking! 📊💰**