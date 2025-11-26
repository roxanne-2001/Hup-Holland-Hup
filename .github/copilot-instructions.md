- Verify that Node.js (v18 or higher) is installed on your system
- The project uses npm as the package manager
- Run `npm install` to install all dependencies
- Run `npm run dev` to start the development server on http://localhost:3000
- Run `npm run build` to create a production build
- All TypeScript/compilation errors will resolve after npm install

### Project Architecture

**Frontend Pages:**
- `/` - Homepage with hero section and features overview
- `/funding` - Browse all funding opportunities 
- `/dashboard` - Personalized dashboard with AI recommendations
- `/startups` - Directory of startups in the network
- `/signup` - Create new account

**API Routes:**
- `/api/funding` - GET endpoint to fetch all funding opportunities
- `/api/recommendations` - POST endpoint for AI-powered recommendations

**Key Features:**
1. LinkedIn-style UI with Tailwind CSS
2. Intelligent recommender system based on startup profile matching
3. Responsive design for all devices
4. TypeScript for type safety
5. Next.js App Router for modern routing

### Recommender Algorithm

The matching system calculates scores based on:
- Industry alignment (40% weight)
- Funding amount fit (35% weight)
- Development stage compatibility (25% weight)

Opportunities scoring above 40/100 are recommended to users.

### Next Steps After Setup

1. Connect to a database (MongoDB/PostgreSQL) for user profiles and funding data
2. Implement user authentication with NextAuth.js or similar
3. Add email notifications for new opportunities
4. Create admin dashboard for managing funding opportunities
5. Implement investor profiles and messaging system
6. Add analytics to track recommendation accuracy
