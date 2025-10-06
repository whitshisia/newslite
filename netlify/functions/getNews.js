import fetch from "node-fetch";

export async function handler(event) {
  const API_KEY = process.env.NEWS_API_KEY;
  const { country = "us", category = "general" } = event.queryStringParameters;

  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  const from = lastWeek.toISOString().split("T")[0];

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&from=${from}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
