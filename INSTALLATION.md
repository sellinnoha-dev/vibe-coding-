# Vibe Pro Agency - Installation Guide

## 📋 Prerequisites

Before you begin, make sure you have:
- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** version 9 or higher (comes with Node.js)
- A code editor like VS Code ([Download](https://code.visualstudio.com/))
- Git (optional, for version control)

## 🚀 Quick Start

### Windows Users
1. Double-click `setup.bat` in the project folder
2. Wait for installation to complete
3. Run `npm run dev` in the terminal
4. Open http://localhost:3000 in your browser

### macOS/Linux Users
1. Open terminal in the project folder
2. Run `chmod +x setup.sh`
3. Run `./setup.sh`
4. Wait for installation to complete
5. Run `npm run dev`
6. Open http://localhost:3000 in your browser

### Manual Setup
1. Open terminal/command prompt
2. Navigate to the project folder:
   ```bash
   cd "path/to/vibe coding"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create `.env.local` file with:
   ```
   CONTACT_EMAIL=contact@vibepro.com
   ```
5. Start development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000

## 📦 Available Scripts

- `npm run dev` - Start development server (hot reload)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Contact form recipient email
CONTACT_EMAIL=your-email@example.com

# Email service API key (optional)
# RESEND_API_KEY=your_api_key_here

# Node environment
NODE_ENV=development
```

### Customization

- **Colors**: Edit `tailwind.config.ts`
- **Content**: Edit files in `/components` and `/app`
- **Images**: Add files to `/public/images`
- **Fonts**: Modify imports in `app/globals.css`

## 🌍 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Vercel automatically detects Next.js
4. Click "Deploy"
5. Your site is live!

### Deploy to Other Platforms

**Netlify:**
- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `.next`

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### npm command not found
- Install Node.js from https://nodejs.org/
- Close and reopen terminal after installation

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Module not found errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build failures
- Check Node.js version: `node --version` (should be 18+)
- Clear cache: `rm -rf .next`
- Reinstall: `npm install`

## 📚 Project Structure

```
vibe-coding/
├── app/
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utilities
├── public/               # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🔒 Security Features

✅ Security headers configured
✅ Input validation with Zod
✅ Rate limiting on API
✅ CSRF protection ready
✅ Type-safe TypeScript
✅ Environment variable protection

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 💡 Tips

- Use VS Code Extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - TypeScript Vue Plugin

- Hot reload works automatically during development
- Changes to CSS apply instantly
- TypeScript errors appear in terminal
- Check console for any warnings

## 🆘 Need Help?

- Check README.md for full documentation
- Visit Next.js docs: https://nextjs.org/docs
- Tailwind CSS docs: https://tailwindcss.com/docs
- React docs: https://react.dev

## 📧 Contact

For issues or questions, create an issue in the GitHub repository.

---

**Happy coding! 🎉**
