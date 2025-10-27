// netlify/functions/news.js
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
let cache = {};

exports.handler = async function(event, context) {
    // Handle CORS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: '',
        };
    }

    const { category = 'general', search = '', type = 'all' } = event.queryStringParameters;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'NewsAPI key not configured' }),
        };
    }

    // Create cache key
    const cacheKey = `${category}-${search}-${type}`;
    const now = Date.now();
    
    // Check cache
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
        console.log('Serving from cache:', cacheKey);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-Cache': 'HIT',
            },
            body: JSON.stringify(cache[cacheKey].data),
        };
    }

    try {
        let url;
        let articles = [];

        if (type === 'breaking') {
            // Get breaking news from general category
            url = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=5&apiKey=${apiKey}`;
        } else if (type === 'trending') {
            // Get trending from multiple categories (limited)
            url = `https://newsapi.org/v2/top-headlines?country=us&category=general&pageSize=5&apiKey=${apiKey}`;
        } else if (search) {
            // Search functionality
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&sortBy=publishedAt&pageSize=40&apiKey=${apiKey}`;
        } else {
            // Main news with more articles to support pagination
            url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=40&apiKey=${apiKey}`;
        }

        console.log('Fetching from API:', url.replace(apiKey, '***'));
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        // Store in cache
        cache[cacheKey] = {
            data: data,
            timestamp: now
        };

        // Clean old cache entries (keep only last 10)
        const cacheKeys = Object.keys(cache);
        if (cacheKeys.length > 10) {
            for (let i = 0; i < cacheKeys.length - 10; i++) {
                delete cache[cacheKeys[i]];
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                'X-Cache': 'MISS',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error in news function:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                error: 'Failed to fetch news',
                details: error.message 
            }),
        };
    }
};