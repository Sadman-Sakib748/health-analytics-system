# HealthSync - AI-Powered Prescription & Health Analytics Management System

A comprehensive healthcare management platform featuring three role-based portals (Patient, Doctor, Admin) with AI-powered prescription analysis using Google Gemini API.

## 🏥 Features

### Patient Portal
- **Prescription Management**: Upload and view prescription images with AI analysis
- **Health Metrics Tracking**: Monitor vital signs and health indicators
- **AI-Powered Health Insights**: Receive personalized health recommendations and warnings based on medications
- **Medication Interaction Checking**: AI analyzes potential drug interactions and side effects
- **Health Records**: View complete medical history and active prescriptions
- **Responsive Dashboard**: Easy-to-use interface for managing personal health

### Doctor Portal
- **Patient Management**: View and manage assigned patients
- **Patient Analytics**: Monitor patient health trends and status
- **Prescription Management**: Review and create new prescriptions
- **Health Data Analysis**: Detailed analytics on patient populations
- **Risk Assessment**: Identify patients needing attention based on health metrics
- **Bulk Actions**: Manage multiple patients efficiently

### Admin Portal
- **User Management**: Create, edit, and manage system users
- **System Analytics**: Monitor platform health and usage metrics
- **Dashboard**: API uptime, active users, server load, database status
- **System Settings**: Configure platform parameters and policies
- **Activity Monitoring**: Track user engagement and system performance
- **Reports**: Generate comprehensive system health reports

## 🚀 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Charts & Visualization**: Recharts for analytics
- **Icons**: Lucide React
- **AI/ML**: Google Gemini API for prescription analysis
- **State Management**: React hooks with local state management
- **UI Components**: shadcn/ui for accessible components

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ or pnpm
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd healthsync
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key_here
```

To generate a Google Gemini API key:
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key for your project
4. Copy and paste it into `.env.local`

4. **Run the development server**
```bash
pnpm dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

## 📋 Usage Guide

### Role-Based Login

The application uses a simple role-based access system:

1. **Patient Portal**
   - Enter your name
   - Upload prescription images for AI analysis
   - Track health metrics and view insights
   - Example: John Doe

2. **Doctor Portal**
   - Enter your name
   - View assigned patients and their health data
   - Manage prescriptions and health records
   - Example: Dr. Sarah Smith

3. **Admin Portal**
   - Enter your name
   - Manage system users and settings
   - Monitor platform health and analytics
   - Example: Admin User

### Prescription Upload (Patient Portal)

1. Click "Upload Prescription" section
2. Drag and drop or select a prescription image
3. AI analyzes the image and extracts:
   - Medication names
   - Dosages
   - Frequency
   - Prescribing doctor
4. View extracted information and AI insights

### Patient Management (Doctor Portal)

1. View your assigned patient list
2. Click "View" to see patient details
3. Use "Edit" to update patient information
4. Click "New Prescription" to create prescriptions
5. View analytics on patient health trends

### System Administration (Admin Portal)

1. Navigate to "User Management" tab
2. Add new users with assigned roles
3. Edit user details and permissions
4. Monitor system health metrics
5. Review platform analytics

## 🤖 AI Integration

The application uses Google Gemini API for:

- **Prescription Image Analysis**: Extract medication information from prescription images
- **Health Insights Generation**: Provide personalized health recommendations
- **Medication Interaction Analysis**: Identify potential drug interactions and warnings
- **Health Risk Assessment**: Analyze patient health trends

### API Features

```typescript
// Example: Analyze prescription image
const analysis = await analyzePrescriptionImage(file);
// Returns: { medication, dosage, frequency, prescribedBy, summary }
```

## 🎨 Design System

### Color Scheme
- **Primary Blue**: #1e40af - Main actions and highlights
- **Secondary Teal**: #0f766e - Secondary elements
- **Accent Red**: #dc2626 - Alerts and important notices
- **Neutral Gray**: Various shades for text and borders
- **Background White**: Clean, professional appearance

### Typography
- **Headings**: Geist Sans (Bold, 600-700 weights)
- **Body Text**: Geist Sans (Regular, 400 weight)
- **Monospace**: Geist Mono for code blocks

## 🔐 Security Considerations

- **Role-Based Access**: Three distinct role-based portals
- **Data Privacy**: HIPAA-friendly design patterns
- **API Security**: Secure Gemini API key handling via environment variables
- **Input Validation**: All user inputs validated before processing

## 📊 Sample Data

The application includes sample data for demonstration:
- Patient database with health records
- Prescription examples
- Doctor assignments
- System analytics and metrics

## 🛠️ Development

### Project Structure
```
healthsync/
├── app/
│   ├── page.tsx              # Main app component
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── auth/
│   │   └── login-view.tsx    # Login/role selection
│   ├── portals/
│   │   ├── patient-portal.tsx
│   │   ├── doctor-portal.tsx
│   │   └── admin-portal.tsx
│   └── features/
│       ├── prescription-upload.tsx
│       ├── health-insights.tsx
│       ├── analytics-charts.tsx
│       ├── patient-list.tsx
│       └── user-management.tsx
├── lib/
│   └── ai-analysis.ts        # Gemini API integration
└── public/
    └── hero-image.png        # Hero image asset
```

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

## 📝 API Reference

### AI Analysis Module
```typescript
// File: lib/ai-analysis.ts

analyzePrescriptionImage(file: File): Promise<{
  success: boolean
  data?: {
    medication: string
    dosage: string
    frequency: string
    prescribedBy: string
    summary: string
  }
  error?: string
}>
```

## 🐛 Troubleshooting

### Prescription Upload Issues
- Ensure image file is JPG, PNG, or similar format
- Check file size is under 5MB
- Verify Gemini API key is correctly set

### Missing Data
- Sample data is loaded on component mount
- Check browser console for error messages
- Ensure API key is valid and has proper permissions

### Performance Issues
- Clear browser cache
- Check network connectivity
- Verify API response times

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. Review environment variable setup
3. Verify Google Gemini API key configuration
4. Check browser console for error messages

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Charts from [Recharts](https://recharts.org)
- AI Power from [Google Gemini API](https://ai.google.dev)

---

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready
