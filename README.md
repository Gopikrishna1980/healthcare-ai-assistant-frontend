# Healthcare AI Assistant - Frontend

Modern React + Next.js frontend for the Healthcare AI Assistant with advanced RAG capabilities.

## Features

- 🤖 **Three Chat Modes**:
  - **Standard RAG**: Basic retrieval with conversational memory
  - **Multi-Agent**: Routes queries to 4 specialized medical agents (Cardiology, Endocrinology, Respiratory, General)
  - **Advanced RAG**: Query decomposition, hybrid search, and LLM reranking

- 💬 **Real-time Chat Interface**
  - Streaming responses (ChatGPT-like)
  - Message history with timestamps
  - Source attribution from knowledge base
  - Cost tracking per query

- 🎨 **Modern UI/UX**
  - Responsive design (mobile, tablet, desktop)
  - Dark mode support
  - Smooth animations
  - Markdown support in messages

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **Markdown**: react-markdown

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local .env.local
# Edit NEXT_PUBLIC_API_URL if needed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
healthcare-ai-assistant-frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── providers.tsx        # React Query provider
│   └── globals.css          # Global styles
├── components/
│   ├── ChatInterface.tsx    # Main chat component
│   ├── ChatHeader.tsx       # Header with branding
│   ├── ModeSelector.tsx     # Mode switching buttons
│   ├── MessageList.tsx      # Message container
│   ├── ChatMessage.tsx      # Individual message
│   └── ChatInput.tsx        # Input field
├── types/
│   └── index.ts             # TypeScript types
└── package.json
```

## API Integration

Connects to backend endpoints:

- `POST /api/chat` - Send question, get answer
- `POST /api/chat/stream` - Streaming responses
- `POST /api/upload` - Upload documents
- `GET /api/metrics` - Cost tracking

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development

```bash
# Run dev server
npm run dev

# Lint code
npm run lint

# Build production
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## License

MIT

## Author

Gopi Krishna Venepalli