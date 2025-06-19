# One Stone - Document Management System

A comprehensive document management system built with React, TypeScript, and Node.js, featuring AI-powered document analysis, Google Drive integration, and compliance tracking.

## Features

### Core Functionality

- **Document Upload & Management**: Upload, organize, and manage documents with AI-powered tagging
- **Google Drive Integration**: Seamless sync with Google Drive, including background sync for files added directly to Drive
- **AI-Powered Analysis**: Automatic document tagging and content extraction using Google Gemini
- **Compliance Tracking**: Monitor document compliance status and expiry dates
- **Version Control**: Track document versions and restore previous versions
- **Search & Filter**: Advanced search and filtering capabilities

### Advanced Features

- **Background Sync**: Automatically detects and processes files added directly to Google Drive
- **Notification System**: Real-time notifications for new files, compliance issues, and expiry warnings
- **Compliance Dashboard**: Visual compliance status tracking with badges and tooltips
- **User Management**: Role-based access control and user management
- **Fee Management**: Comprehensive fee calculation and reporting system
- **Client Management**: Client onboarding and management tools

## Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching
- **Supabase** for authentication and database

### Backend

- **Node.js** with TypeScript
- **Express.js** for API routing
- **Google Drive API** for file management
- **Google Gemini AI** for document analysis
- **Firebase Firestore** for data storage
- **Multer** for file uploads

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Platform account
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/zhaohans/one-stone.git
   cd one-stone
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Environment Setup**

   Create `.env` files in both root and backend directories with your API keys and configuration.

4. **Start the application**

   ```bash
   # Start backend
   cd backend && npm run dev

   # Start frontend (in new terminal)
   npm run dev
   ```

## Project Structure

```
one-stone/
├── src/                    # Frontend source code
├── backend/               # Backend source code
├── supabase/              # Database migrations
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
// Chromatic test trigger
