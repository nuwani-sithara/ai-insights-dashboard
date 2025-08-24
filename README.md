# AI Insights Dashboard

A modern, responsive Next.js dashboard application that provides powerful analytics visualization and AI-powered insights. Built with the latest web technologies and featuring a beautiful dark/light theme toggle.

![AI Insights Dashboard](https://img.shields.io/badge/Next.js-14.2.32-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0-FF6384?style=for-the-badge&logo=chart.js)

## ✨ Features

### 🎨 **Theme System**
- **Dark/Light Theme Toggle** - Beautiful theme switching with smooth transitions
- **System Preference Detection** - Automatically detects user's system theme preference
- **Persistent Storage** - Remembers user's theme choice across sessions
- **Smooth Animations** - 0.2s ease-in-out transitions for all theme changes

### 📊 **Analytics Dashboard**
- **Real-time Data Fetching** - Live data from external APIs
- **Multiple Chart Types** - Bar charts, pie charts, and doughnut charts
- **Comprehensive Metrics** - Product counts, categories, pricing, and stock analysis
- **Interactive Visualizations** - Responsive charts with hover effects
- **Data Tables** - Detailed product information with sorting and filtering

### 🤖 **AI Tools Integration**
- **Multiple AI Providers** - Cohere AI (free tier) with Hugging Face fallback
- **Smart Prompt Handling** - Context-aware AI responses
- **Real-time Processing** - Live AI interaction with loading states
- **Error Handling** - Graceful fallbacks and user-friendly error messages

### 📱 **Responsive Design**
- **Mobile-First Approach** - Optimized for all screen sizes
- **Collapsible Sidebar** - Touch-friendly mobile navigation
- **Adaptive Layouts** - Responsive grids and components
- **Touch Interactions** - Mobile-optimized user experience

## 🚀 Tech Stack

### **Frontend Framework**
- **Next.js 14** - Latest App Router with server-side rendering
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript 5** - Type-safe development experience

### **Styling & UI**
- **Tailwind CSS 3** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icon library
- **Custom Components** - Reusable, themed UI components

### **Data Visualization**
- **Chart.js 4** - Powerful charting library
- **react-chartjs-2** - React wrapper for Chart.js
- **Multiple Chart Types** - Bar, Pie, Doughnut, and Line charts

### **AI Integration**
- **Cohere AI** - Primary AI service (free tier available)
- **Hugging Face** - Fallback AI service
- **RESTful APIs** - Clean API architecture

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Cross-browser CSS compatibility

## 📁 Project Structure

```
ai-insights-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── ai-tools/          # AI tools interaction page
│   │   ├── api/               # API routes
│   │   │   └── llm/          # AI service endpoint
│   │   ├── globals.css        # Global styles and theme
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   │   ├── DashboardLayout.tsx # Main layout wrapper
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── TopNavbar.tsx      # Top navigation with theme toggle
│   └── contexts/              # React contexts
│       └── ThemeContext.tsx   # Theme management context
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🛠️ Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-insights-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   COHERE_API_KEY=your_cohere_api_key_here
   HUGGING_FACE_API_KEY=your_hugging_face_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🎯 Pages & Features

### **🏠 Home Page**
- Welcome message and project overview
- Navigation cards to Analytics and AI Tools
- Feature highlights and usage tips
- Responsive grid layout with hover effects

### **📊 Analytics Dashboard**
- **Summary Cards**: Total products, categories, average price, total stock
- **Category Distribution**: Bar and pie charts showing product categories
- **Price Analysis**: Doughnut chart for price range distribution
- **Stock Analysis**: Stock level visualization
- **Category Details**: In-depth analysis with brands and subcategories
- **Product Table**: Comprehensive data table with all product information
- **Real-time Data**: Live fetching from external APIs

### **🤖 AI Tools**
- **Text Input**: Large textarea for user prompts
- **AI Processing**: Real-time AI response generation
- **Multiple Providers**: Cohere AI with Hugging Face fallback
- **Response Display**: Formatted AI responses with clear styling
- **Usage Tips**: Helpful prompt examples and feature descriptions
- **Error Handling**: User-friendly error messages and retry options

## ⚙️ Configuration

### **Tailwind CSS**
The project uses Tailwind CSS with custom configuration:
- Dark mode enabled with `class` strategy
- Custom color palette for primary colors
- Responsive breakpoints for mobile-first design

### **Theme System**
- **Context-based**: React Context API for global theme state
- **Local Storage**: Persistent theme preferences
- **System Detection**: Automatic theme detection from OS
- **Smooth Transitions**: CSS transitions for theme switching

### **API Configuration**
- **Cohere AI**: Primary AI service (free tier available)
- **Hugging Face**: Fallback AI service
- **Error Handling**: Graceful degradation between services
- **Rate Limiting**: Built-in request management

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile Features**
- Collapsible sidebar navigation
- Touch-friendly interface elements
- Optimized chart sizes for small screens
- Responsive data tables with horizontal scrolling

### **Desktop Features**
- Fixed sidebar navigation
- Multi-column layouts
- Large chart displays
- Enhanced hover effects and interactions

## 🎨 Customization

### **Colors & Themes**
- Primary color scheme in `tailwind.config.js`
- Dark mode color palette
- Custom CSS variables for consistent theming
- Easy color scheme modifications

### **Components**
- Reusable component library
- Consistent styling patterns
- Easy to extend and modify
- TypeScript interfaces for props

### **Charts**
- Configurable chart options
- Custom color schemes
- Responsive chart sizing
- Interactive tooltips and legends

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
npm run start
```

### **Environment Variables**
Ensure all required environment variables are set in production:
- `COHERE_API_KEY`
- `HUGGING_FACE_API_KEY`
- `NODE_ENV=production`

### **Deployment Platforms**
- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Static site generation support
- **AWS**: Serverless deployment options
- **Docker**: Containerized deployment

## 🔧 Troubleshooting

### **Common Issues**

1. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Theme Not Working**
   - Check browser console for errors
   - Verify Tailwind CSS is properly configured
   - Ensure `darkMode: 'class'` in `tailwind.config.js`

3. **API Errors**
   - Verify API keys in `.env.local`
   - Check network connectivity
   - Review API rate limits

4. **Chart Display Issues**
   - Ensure Chart.js is properly imported
   - Check for JavaScript errors in console
   - Verify data format matches expected structure

### **Performance Optimization**
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Built-in Next.js image optimization
- **Bundle Analysis**: Use `@next/bundle-analyzer`
- **Lazy Loading**: Implement for heavy components

## 📈 Future Enhancements

### **Planned Features**
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: Machine learning insights
- **User Authentication**: Secure user management
- **Data Export**: CSV/PDF export functionality
- **Custom Dashboards**: User-configurable layouts

### **AI Improvements**
- **Multi-modal AI**: Image and text analysis
- **Custom Models**: Fine-tuned AI models
- **Batch Processing**: Multiple prompt handling
- **AI Training**: User feedback integration

## 🤝 Contributing

### **Development Guidelines**
1. Fork the repository
2. Create a feature branch
3. Follow TypeScript and ESLint rules
4. Add comprehensive tests
5. Submit a pull request

### **Code Style**
- Use TypeScript for all new code
- Follow React best practices
- Implement responsive design
- Add proper error handling
- Include loading states

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Powerful charting library
- **Cohere AI** - Free AI service tier
- **Hugging Face** - Open-source AI models

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation
- Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**