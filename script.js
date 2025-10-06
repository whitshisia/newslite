const container = document.getElementById("news-container");
const countrySelect = document.getElementById("country-select");
const categoryButtons = document.querySelectorAll(".category-tab");
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

  container.innerHTML = `<p class="col-span-full text-center text-gray-500">Loading news...</p>`;

  try {
    const res = await fetch(`/.netlify/functions/getNews?country=${country}&category=${category}`);
    const data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify({ articles: data.articles, timestamp: Date.now() }));
    renderNews(data.articles);
  } catch (error) {
    container.innerHTML = `<p class="col-span-full text-center text-red-500">⚠️ Error: ${error.message}</p>`;
  }
}

function renderNews(articles, fromCache = false) {
  if (!articles?.length) {
    container.innerHTML = `<p class="col-span-full text-center text-gray-400">No news available.</p>`;
    return;
  }

  container.innerHTML = articles
    .filter(a => a.urlToImage)
    .map(article => `
      <article class="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
        <img src="${article.urlToImage}" alt="news" class="h-48 w-full object-cover">
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="font-semibold mb-2 text-lg">${article.title}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 flex-grow">${article.description || ""}</p>
          <a href="${article.url}" target="_blank" class="mt-3 text-primary font-medium hover:underline">Read more →</a>
        </div>
      </article>
    `)
    .join("");
}

// Event Listeners
countrySelect.addEventListener("change", () => {
  currentCountry = countrySelect.value;
  localStorage.setItem("country", currentCountry);
  fetchNews(currentCountry, currentCategory);
});

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active-tab", "bg-white", "text-primary"));
    btn.classList.add("active-tab", "bg-white", "text-primary");
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
