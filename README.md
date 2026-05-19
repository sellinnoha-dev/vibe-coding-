# Vibe Pro - Professional Digital Agency

A modern, professional website built with cutting-edge web technologies.

## Features

✨ **Modern Stack**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Dark/Light theme support

🔒 **Security**
- Security headers (CSP, X-Frame-Options, etc.)
- Input validation with Zod
- Rate limiting for API endpoints
- CSRF protection ready
- Environment variables support

⚡ **Performance**
- Image optimization
- Code splitting
- Fast refresh development
- Production-grade builds
- SEO optimized

🎨 **User Experience**
- Responsive design (mobile-first)
- Smooth animations and transitions
- Accessible components
- Dark mode support
- Fast load times

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibe-pro-agency
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
CONTACT_EMAIL=your-email@example.com
RESEND_API_KEY=your-api-key # Optional: for email service
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Additional styles
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Building for Production

```bash
npm run build
npm run start
```

## Key Components

### Navigation
- Sticky header with theme toggle
- Smooth scroll behavior
- Mobile-responsive menu

### Hero Section
- Eye-catching headline
- Call-to-action buttons
- Animated background

### Services
- 6 main service offerings
- Hover animations
- Icon-based design

### Portfolio
- Featured projects showcase
- Category filtering
- Hover effects

### Contact Form
- Email validation
- Error handling
- Success feedback
- Rate limiting

### Footer
- Company information
- Quick links
- Social media links
- Copyright information

## Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: '#0F172A',
  secondary: '#1E293B',
  accent: '#00D9FF',
  // ... more colors
}
```

### Content
- Edit component files in `/components`
- Update page content in `/app/page.tsx`
- Modify text and copy throughout

### Animations
- Framer Motion is configured globally
- Adjust animation settings in component files
- Add new animations in `tailwind.config.ts`

## Environment Variables

```
CONTACT_EMAIL=contact@example.com
RESEND_API_KEY=your-email-service-api-key (optional)
NODE_ENV=production
```

## API Routes

### POST /api/contact
Submit contact form

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services..."
}
```

**Response:**
```json
{
  "message": "Message sent successfully"
}
```

## Security Features

1. **Headers**: Configured security headers in `next.config.js`
2. **Validation**: Zod schema validation on all inputs
3. **Rate Limiting**: Built-in rate limiting for API endpoints
4. **Type Safety**: Full TypeScript support
5. **Environment Variables**: Sensitive data protected
6. **CSP**: Content Security Policy configured

## Performance Optimizations

- Image optimization with Next.js Image component
- CSS minification
- JavaScript code splitting
- Server-side rendering where beneficial
- Lazy loading for images and components
- Optimized font loading
- Compression enabled

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Docker containers
- Traditional Node.js hosting

## Maintenance

- Keep dependencies updated: `npm update`
- Run linting: `npm run lint`
- Build for production: `npm run build`
- Monitor performance: Use Vercel Analytics or similar

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this template for your projects

## Support

For issues or questions, please contact us at contact@vibepro.com

---

Built with ❤️ using Next.js, React, and Tailwind CSS
