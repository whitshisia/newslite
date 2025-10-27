class NewsApp {
    constructor() {
        this.baseUrl = '/.netlify/functions/news';
        this.currentCategory = 'general';
        this.currentSearch = '';
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadNews();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            this.handleSearch();
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleCategoryChange(e.target);
            });
        });
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        this.currentSearch = searchInput.value.trim();
        this.currentCategory = 'general';
        this.updateActiveFilter();
        this.loadNews();
    }

    handleCategoryChange(button) {
        this.currentCategory = button.dataset.category;
        this.currentSearch = '';
        document.getElementById('searchInput').value = '';
        this.updateActiveFilter(button);
        this.loadNews();
    }

    updateActiveFilter(activeButton = null) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        if (activeButton) {
            activeButton.classList.add('active');
        } else {
            document.querySelector(`[data-category="${this.currentCategory}"]`).classList.add('active');
        }
    }

    async loadNews() {
        this.showLoading();
        this.hideError();

        try {
            // Build URL with parameters
            const params = new URLSearchParams();
            if (this.currentSearch) {
                params.append('search', this.currentSearch);
            } else {
                params.append('category', this.currentCategory);
            }

            const url = `${this.baseUrl}?${params.toString()}`;
            console.log('Fetching news from:', url);

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.articles) {
                this.displayNews(data.articles);
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                throw new Error('Invalid response format');
            }

        } catch (error) {
            console.error('Error fetching news:', error);
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    displayNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = `
                <div class="error">
                    <p>No news articles found. Try a different search term or category.</p>
                </div>
            `;
            return;
        }

        const newsHTML = articles.map(article => `
            <div class="news-card">
                <img src="${article.urlToImage || 'https://via.placeholder.com/400x200/667eea/ffffff?text=No+Image+Available'}" 
                     alt="${article.title}" 
                     class="news-image"
                     onerror="this.src='https://via.placeholder.com/400x200/667eea/ffffff?text=No+Image+Available'">
                <div class="news-content">
                    <h3 class="news-title">${this.truncateText(article.title, 100)}</h3>
                    <p class="news-description">${this.truncateText(article.description || 'No description available', 120)}</p>
                    <div class="news-meta">
                        <span class="news-date">${this.formatDate(article.publishedAt)}</span>
                        <span class="news-source">${article.source.name}</span>
                    </div>
                </div>
            </div>
        `).join('');

        newsContainer.innerHTML = newsHTML;
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('newsContainer').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('newsContainer').classList.remove('hidden');
    }

    showError(message = 'Failed to load news. Please try again later.') {
        const errorElement = document.getElementById('errorMessage');
        errorElement.querySelector('p').textContent = message;
        errorElement.classList.remove('hidden');
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NewsApp();
});