const container = document.getElementById("news-container");
const countrySelect = document.getElementById("country-select");
const categoryButtons = document.querySelectorAll(".categories button");
const themeToggle = document.getElementById("theme-toggle");

let currentCountry = localStorage.getItem("country") || "us";
let currentCategory = localStorage.getItem("category") || "general";

countrySelect.value = currentCountry;

// Apply saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
}

async function fetchNews(country, category) {
  const cacheKey = `${country}-${category}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    const { articles, timestamp } = JSON.parse(cached);
    const oneHour = 3600 * 1000;
    if (Date.now() - timestamp < oneHour) {
      renderNews(articles, true);
      return;
    }
  }

  container.innerHTML = "<p>Loading news...</p>";

  try {
    const res = await fetch(`/.netlify/functions/getNews?country=${country}&category=${category}`);
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify({ articles: data.articles, timestamp: Date.now() }));
    renderNews(data.articles);
  } catch (error) {
    container.innerHTML = `<p>⚠️ Error: ${error.message}</p>`;
  }
}

function renderNews(articles, fromCache = false) {
  if (!articles?.length) {
    container.innerHTML = "<p>No news available.</p>";
    return;
  }

  container.innerHTML = articles
    .filter(a => a.urlToImage)
    .map(article => `
      <div class="article">
        <img src="${article.urlToImage}" alt="news" />
        <div class="article-content">
          <h3>${article.title}</h3>
          <p>${article.description || ""}</p>
          <a href="${article.url}" target="_blank">Read more →</a>
        </div>
      </div>
    `)
    .join("");

  if (fromCache) {
    console.log("Loaded from cache:", articles.length, "articles");
  }
}

// Event Listeners
countrySelect.addEventListener("change", () => {
  currentCountry = countrySelect.value;
  localStorage.setItem("country", currentCountry);
  fetchNews(currentCountry, currentCategory);
});

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    localStorage.setItem("category", currentCategory);
    fetchNews(currentCountry, currentCategory);
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Initial Load
fetchNews(currentCountry, currentCategory);
