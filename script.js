class NewsApp {
    constructor() {
        this.baseUrl = '/.netlify/functions/news';
        this.currentCategory = 'general';
        this.currentSearch = '';
        this.currentPage = 1;
        this.totalPages = 10; // Maximum pages to show
        this.articlesPerPage = 20;
        this.totalResults = 0;
        this.allArticles = [];
        
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadBreakingNews();
        this.loadTrendingNews();
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

        // Pagination
        document.getElementById('firstPage').addEventListener('click', () => {
            this.goToPage(1);
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            this.goToPage(this.currentPage - 1);
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.goToPage(this.currentPage + 1);
        });

        document.getElementById('lastPage').addEventListener('click', () => {
            this.goToPage(this.totalPages);
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.loadNews();
        });
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        this.currentSearch = searchInput.value.trim();
        this.currentCategory = 'general';
        this.currentPage = 1;
        this.updateActiveFilter();
        this.loadNews();
    }

    handleCategoryChange(button) {
        this.currentCategory = button.dataset.category;
        this.currentSearch = '';
        this.currentPage = 1;
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
            const generalBtn = document.querySelector('[data-category="general"]');
            if (generalBtn) generalBtn.classList.add('active');
        }
    }

    async loadBreakingNews() {
        try {
            const url = `${this.baseUrl}?category=general&pageSize=5`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    this.displayBreakingNews(data.articles);
                }
            }
        } catch (error) {
            console.error('Error loading breaking news:', error);
        }
    }

    displayBreakingNews(articles) {
        const breakingNewsElement = document.getElementById('breakingNews');
        const tickerElement = document.getElementById('breakingNewsTicker');
        
        const breakingTitles = articles
            .slice(0, 3)
            .map(article => this.truncateText(article.title, 80))
            .join(' ••• ');

        tickerElement.textContent = breakingTitles;
        breakingNewsElement.classList.remove('hidden');
    }

    async loadTrendingNews() {
        try {
            const url = `${this.baseUrl}?category=general&pageSize=5`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    this.displayTrendingNews(data.articles.slice(0, 5));
                }
            }
        } catch (error) {
            console.error('Error loading trending news:', error);
        }
    }

    displayTrendingNews(articles) {
        const trendingContainer = document.getElementById('trendingNews');
        
        const trendingHTML = articles.map((article, index) => `
            <div class="trending-item" onclick="newsApp.handleTrendingClick(${index})">
                <div class="trending-title">${this.truncateText(article.title, 60)}</div>
                <div class="trending-source">${article.source.name}</div>
            </div>
        `).join('');

        trendingContainer.innerHTML = trendingHTML;
    }

    handleTrendingClick(index) {
        // For demo purposes, just show an alert
        // In a real app, you might want to show the full article
        alert('Trending article clicked! In a real app, this would open the full article.');
    }

    async loadNews() {
        this.showLoading();
        this.hideError();
        this.hidePagination();

        try {
            const params = new URLSearchParams();
            if (this.currentSearch) {
                params.append('search', this.currentSearch);
                params.append('page', this.currentPage);
            } else {
                params.append('category', this.currentCategory);
                params.append('page', this.currentPage);
            }

            const url = `${this.baseUrl}?${params.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.articles) {
                this.allArticles = data.articles;
                this.totalResults = data.totalResults || this.allArticles.length;
                this.displayNews(this.getCurrentPageArticles());
                this.setupPination();
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

    getCurrentPageArticles() {
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        return this.allArticles.slice(startIndex, endIndex);
    }

    displayNews(articles) {
        const newsContainer = document.getElementById('newsContainer');
        
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-search"></i>
                    <p>No news articles found. Try a different search term or category.</p>
                </div>
            `;
            return;
        }

        const newsHTML = articles.map(article => `
            <div class="news-card fade-in">
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

    setupPination() {
        if (this.allArticles.length <= this.articlesPerPage) {
            this.hidePagination();
            return;
        }

        this.showPagination();
        this.updatePagination();
    }

    updatePagination() {
        const totalArticles = this.allArticles.length;
        this.totalPages = Math.min(10, Math.ceil(totalArticles / this.articlesPerPage));
        
        // Update page info
        document.getElementById('currentPage').textContent = this.currentPage;
        document.getElementById('totalPages').textContent = this.totalPages;
        document.getElementById('totalResults').textContent = totalArticles;

        // Update pagination buttons state
        document.getElementById('firstPage').disabled = this.currentPage === 1;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === this.totalPages;
        document.getElementById('lastPage').disabled = this.currentPage === this.totalPages;

        // Generate page numbers
        const pageNumbersContainer = document.getElementById('pageNumbers');
        let pageNumbersHTML = '';

        // Show first page, current page range, and last page
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersHTML += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        onclick="newsApp.goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        pageNumbersContainer.innerHTML = pageNumbersHTML;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages || page === this.currentPage) return;
        
        this.currentPage = page;
        this.displayNews(this.getCurrentPageArticles());
        this.updatePagination();
        
        // Scroll to top of news container
        document.getElementById('newsContainer').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    showPagination() {
        document.getElementById('pagination').classList.remove('hidden');
        document.getElementById('pageInfo').classList.remove('hidden');
    }

    hidePagination() {
        document.getElementById('pagination').classList.add('hidden');
        document.getElementById('pageInfo').classList.add('hidden');
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
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('newsContainer').classList.add('hidden');
        this.hidePagination();
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('newsContainer').classList.remove('hidden');
    }

    showError(message = 'Failed to load news. Please try again later.') {
        const errorElement = document.getElementById('errorMessage');
        errorElement.querySelector('p').textContent = message;
        errorElement.classList.remove('hidden');
        document.getElementById('newsContainer').classList.add('hidden');
        this.hidePagination();
    }

    hideError() {
        document.getElementById('errorMessage').classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
let newsApp;
document.addEventListener('DOMContentLoaded', () => {
    newsApp = new NewsApp();
});