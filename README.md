# ExtraHand Support Portal (Frontend)

A modern, responsive help center built with Next.js 14 for ExtraHand - Your trusted task marketplace.

**Note**: This is the frontend application only. The backend API is in the `SupportServerBackend` folder.

## 🎨 Features

- **Modern Design**: Clean, responsive UI matching ExtraHand brand colors (Yellow/Amber theme)
- **Search Functionality**: Full-text search across all articles
- **Category Organization**: Articles organized into logical categories
- **Article Management**: Easy-to-read articles with markdown support
- **Contact Form**: Multiple contact options including email, phone, and live chat
- **User Authentication**: Login and signup pages integrated with backend API
- **Mobile Responsive**: Fully responsive design for all devices
- **Performance Optimized**: Built with Next.js 14 for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running on port 5001 (see `SupportServerBackend` folder)

### Installation

```bash
# Install dependencies
npm install

# Configure environment variables
# Create .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:5001

# Run development server
npm run dev
```

Open [http://localhost:3004](http://localhost:3004) to view the support portal.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🔌 Backend Integration

This frontend connects to the SupportServerBackend API:
- **Backend URL**: `http://localhost:5001`
- **Auth Endpoints**: `/api/auth/login`, `/api/auth/signup`
- **Contact Endpoint**: `/api/contact`

Make sure the backend server is running before starting the frontend.

## 📁 Project Structure

```
SupportServer/
├── src/
│   ├── app/
│   │   ├── article/[id]/     # Individual article pages
│   │   ├── articles/         # All articles listing
│   │   ├── category/[slug]/  # Category pages
│   │   ├── contact/          # Contact page
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   ├── search/           # Search results
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── Header.tsx        # Navigation header
│   │   └── Footer.tsx        # Footer component
│   ├── contexts/             # React contexts
│   ├── data/
│   │   └── articles.ts       # Article data and utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Branding

The portal uses ExtraHand's brand colors:
- **Primary**: Yellow/Amber (#FBC341)
- **Accent**: Darker Amber (#EAB308)
- **Background**: White with yellow tints
- **Text**: Gray-900 for primary, Gray-600 for secondary

## 📝 Adding Content

### Adding New Articles

Edit `src/data/articles.ts` and add new articles to the array:

```typescript
{
  id: 'unique-id',
  title: 'Article Title',
  description: 'Brief description',
  category: 'Category Name',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  views: 0,
  content: `
    # Article Content in Markdown
    Your content here...
  `,
}
```

### Adding Categories

Categories are defined in:
- Homepage: `src/app/page.tsx` (categories array)
- Category pages: `src/app/category/[slug]/page.tsx` (categoryInfo object)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Markdown**: react-markdown

## 📦 Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "lucide-react": "^0.344.0",
  "react-markdown": "^9.0.1",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

## 🔧 Configuration

### Ports
- Frontend: `http://localhost:3004`
- Backend: `http://localhost:5001`

### Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
CLIENT_URL=http://localhost:3004
NODE_ENV=development
```

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Markdown**: react-markdown
- **Authentication**: JWT tokens from backend API

## 📄 License

This project is part of the ExtraHand platform.

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain ExtraHand branding guidelines
3. Test responsive design on multiple devices
4. Update documentation for new features

## 📧 Contact

For questions about this support portal:
- Email: support@extrahand.com
- Phone: +91 123-456-7890

---

Built with ❤️ for ExtraHand
