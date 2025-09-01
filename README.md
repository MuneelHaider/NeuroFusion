# NeuroFusion - AI-Powered Healthcare Platform

A modern, AI-powered healthcare platform built with Next.js, MongoDB, and TypeScript.

## Features

- **AI-Powered Healthcare Solutions** - Advanced telemedicine with AI diagnosis tools
- **User Authentication** - Secure login/signup with JWT tokens
- **Role-Based Access** - Support for doctors, patients, and administrators
- **Modern UI/UX** - Beautiful, responsive design with smooth animations
- **MongoDB Integration** - Scalable database backend
- **Real-time Features** - Teleconsultation and appointment management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: bcrypt
- **State Management**: React hooks with custom useAuth hook

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- MongoDB database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NeuroFusion
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb+srv://DevTeam:q1w2e3r4@NeuroFusion.oeogigk.mongodb.net/
   
   # JWT Secret Key (change this in production)
   JWT_SECRET=ABC@123
   
   # Environment
   NODE_ENV=development
   
   # Database Name (optional - will use default from connection string)
   MONGODB_DB=NeuroFusion
   
   # Server Configuration
   PORT=3000
   HOST=localhost
   
   # Security
   COOKIE_SECRET=NeuroFusion-cookie-secret-2024
   SESSION_SECRET=NeuroFusion-session-secret-2024
   
   # API Configuration
   API_BASE_URL=http://localhost:3000
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Request/Response Examples

#### Signup
```json
POST /api/auth/signup
{
  "role": "doctor",
  "fullName": "Dr. John Smith",
  "email": "john@example.com",
  "password": "password123",
  "specialty": "Cardiology",
  "licenseNumber": "MD12345"
}
```

#### Login
```json
POST /api/auth/login
{
  "role": "doctor",
  "email": "john@example.com",
  "password": "password123"
}
```

## Database Schema

### Users Collection
```typescript
interface User {
  _id: string;
  role: 'doctor' | 'patient' | 'admin';
  fullName: string;
  email: string;
  password: string; // hashed with bcrypt
  createdAt: Date;
  specialty?: string; // for doctors
  licenseNumber?: string; // for doctors
}
```

## Project Structure

```
├── app/
│   ├── api/auth/          # Authentication APIs
│   ├── auth/              # Auth pages (login/signup)
│   ├── doctor/            # Doctor dashboard pages
│   ├── patient/           # Patient dashboard pages
│   └── admin/             # Admin dashboard pages
├── components/
│   ├── auth/              # Authentication components
│   ├── ui/                # Reusable UI components
│   └── layout/            # Layout components
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── types/
│   └── auth.ts            # TypeScript interfaces
├── utils/
│   └── mongoDbClient.ts   # MongoDB connection
└── public/
    └── images/            # Static assets
```

## Authentication Flow

1. **Registration**: User creates account with role selection
2. **Login**: User authenticates with email/password
3. **JWT Token**: Server creates JWT token and sets HTTP-only cookie
4. **Protected Routes**: Client checks authentication status via `/api/auth/me`
5. **Role-Based Access**: Different dashboards based on user role

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, time-limited authentication
- **HTTP-Only Cookies**: XSS protection
- **Input Validation**: Server-side validation for all inputs
- **MongoDB Injection Protection**: Parameterized queries

## Development

### Adding New Features

1. Create API routes in `app/api/`
2. Add TypeScript interfaces in `types/`
3. Create React components in `components/`
4. Update the main page in `app/page.tsx`

### Database Operations

Use the MongoDB client from `utils/mongoDbClient.ts`:

```typescript
import clientPromise from "@/utils/mongoDbClient";

const client = await clientPromise;
const db = client.db();
const collection = db.collection("users");
```

## Environment Variables

The following environment variables are required in your `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_DB` | Database name (optional) | `NeuroFusion` |
| `PORT` | Server port (optional) | `3000` |
| `HOST` | Server host (optional) | `localhost` |

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Use strong JWT secret
   - Set `NODE_ENV=production`
   - Configure production MongoDB URI

3. **Deploy to your preferred platform**
   - Vercel (recommended for Next.js)
   - Netlify
   - AWS, Google Cloud, etc.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository. 