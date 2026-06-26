# News Pulse - Modern News Aggregator

A responsive, feature-rich news aggregator web application that delivers the latest headlines from various categories using NewsAPI. Built with vanilla JavaScript, HTML, CSS, and deployed on Netlify.

![News Pulse](https://img.shields.io/badge/News-Pulse-blue) ![Netlify](https://img.shields.io/badge/Deployed-Netlify-success) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) ![Responsive](https://img.shields.io/badge/Design-Responsive-green)

## 🌟 Features

### 🚀 Core Functionality
- **Latest News Headlines** - Real-time news from multiple categories
- **Smart Search** - Find news articles by keywords
- **Category Filtering** - Browse news by topics (General, Business, Technology, Sports, etc.)
- **Breaking News Ticker** - Animated live news ticker for urgent updates
- **Trending Section** - Sidebar showcasing popular articles

### 🎨 User Experience
- **Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **Pagination** - Browse through articles with intuitive page navigation
- **Modern UI/UX** - Clean, professional design with smooth animations
- **Loading States** - Elegant loading spinners and error handling
- **Fast Performance** - Optimized API usage with caching

### ⚡ Technical Features
- **Netlify Functions** - Serverless backend for API management
- **Caching System** - Reduces API calls and improves performance
- **Error Handling** - Graceful error recovery and user feedback
- **SEO Friendly** - Proper HTML structure and meta tags

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Netlify Functions (Serverless)
- **API**: NewsAPI.org
- **Deployment**: Netlify
- **Icons**: Font Awesome 6
- **Fonts**: Google Fonts (Segoe UI)

## 📋 Prerequisites

Before you begin, ensure you have:

- A [NewsAPI.org](https://newsapi.org) account (free tier available)
- A [Netlify](https://netlify.com) account for deployment
- Basic knowledge of JavaScript and web development

## 🚀 Quick Start

### 1. Get Your NewsAPI Key

1. Sign up at [newsapi.org](https://newsapi.org/register)
2. Verify your email address
3. Get your API key from the dashboard

### 2. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd news-pulse

# Project Structure
news-app/
├── netlify/
│   └── functions/
│       └── news.js
├── index.html
├── style.css
├── script.js
└── netlify.toml
```

### 3. Environment Setup

Create a `.env` file for local development:
```env
NEWS_API_KEY=your_actual_api_key_here
```

### 4. Run Locally with Netlify Dev

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Serve locally with functions support
netlify dev
```

Visit `http://localhost:8888` to see your application.

## 📦 Deployment

### Method 1: Git Repository (Recommended)

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

### Method 2: Drag & Drop

1. Zip your project folder
2. Drag and drop to [Netlify Drop](https://app.netlify.com/drop)
3. Configure environment variables

### Environment Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add a new variable:
   - Key: `NEWS_API_KEY`
   - Value: Your NewsAPI key

## ⚙️ Configuration

### NewsAPI Free Tier Limits
- **100 requests per day**
- **1,000 requests per month**
- Rate limiting optimized in the code
- Caching implemented to reduce API calls

### Customization Options

#### Modify Categories
Edit the category filters in `index.html`:
```html
<button class="filter-btn" data-category="technology">
    <i class="fas fa-laptop-code"></i> Technology
</button>
```

#### Adjust Pagination
Update in `script.js`:
```javascript
this.articlesPerPage = 8; // Articles per page
this.totalPages = 5;      // Maximum pages to show
```

#### Change Cache Duration
Modify in `netlify/functions/news.js`:
```javascript
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## 🎯 Usage Guide

### For Users
1. **Browse News**: Select categories from the sidebar
2. **Search**: Use the search bar to find specific topics
3. **Read Articles**: Click on news cards to read full stories
4. **Navigate**: Use pagination to browse through articles
5. **Stay Updated**: Watch the breaking news ticker for urgent updates

### For Developers
#### Adding New Categories
1. Add button in `index.html`
2. Update category filter in `script.js`
3. Test API response for the new category

#### Customizing Styling
- Main styles: `style.css`
- Color scheme: CSS custom properties in `:root`
- Responsive breakpoints: Mobile-first approach

#### Extending Functionality
- Add new Netlify functions in `/netlify/functions/`
- Modify the NewsApp class in `script.js`
- Update HTML structure as needed

## 🔧 API Usage Optimization

The application is optimized for NewsAPI's free tier:

### Smart Caching
- **Server-side caching**: 5-minute cache in Netlify functions
- **Reduced API calls**: Single call fetches multiple data points
- **Efficient pagination**: Client-side pagination reduces API requests

### Rate Limit Management
```javascript
// Features to stay within limits:
- Single API call per session
- Client-side pagination
- Local storage fallback
- Mock data capability
```

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to load news" error**
   - Check NewsAPI key configuration
   - Verify Netlify environment variables
   - Check API rate limits

2. **CORS errors**
   - Ensure Netlify function CORS headers are set
   - Verify function deployment

3. **Images not loading**
   - NewsAPI may not provide images for all articles
   - Placeholder images are used as fallback

4. **Pagination not working**
   - Check JavaScript console for errors
   - Verify article count and pagination logic

### Debug Mode
Add to `script.js` for detailed logging:
```javascript
constructor() {
    this.debug = true;
    // ... rest of constructor
}
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Privacy & Security

- No user data collection
- API keys stored securely in environment variables
- HTTPS enforced on Netlify
- No third-party tracking

## 📈 Performance

- **Load Time**: < 3 seconds
- **API Response**: Cached responses
- **Mobile Score**: 90+ Lighthouse
- **Accessibility**: WCAG 2.1 compliant

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow JavaScript ES6+ standards
- Use responsive design principles
- Maintain accessibility standards
- Test across multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org) for providing news data
- [Netlify](https://netlify.com) for seamless deployment
- [Font Awesome](https://fontawesome.com) for beautiful icons
- Contributors and testers

## 📞 Support

- **Documentation**: [GitHub Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: your-email@example.com

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic news aggregation
- Responsive design
- Netlify deployment

### v1.1.0
- Added breaking news ticker
- Trending news sidebar
- Enhanced pagination
- Performance optimizations

---

**Built with ❤️ using modern web technologies**

*Stay informed, stay ahead with News Pulse!*
