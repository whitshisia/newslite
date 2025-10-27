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

    const { category = 'general', search = '' } = event.queryStringParameters;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'NewsAPI key not configured' }),
        };
    }

    let url;
    try {
        if (search) {
            url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(search)}&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;
        } else {
            url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=20&apiKey=${apiKey}`;
        }

        console.log('Fetching from:', url.replace(apiKey, '***')); // Log without exposing API key

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error in news function:', error);
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Failed to fetch news',
                details: error.message 
            }),
        };
    }
};