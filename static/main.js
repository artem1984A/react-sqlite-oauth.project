/*/ Function to fetch Node.js related news
async function fetchNews() {
    try {
        const response = await fetch('api.goperigon.com/v1/all?apiKey=[0b0372a3-66fc-499e-9b77-55827765eba4]&title=node.js');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Display news on the page
        const newsDiv = document.getElementById('news');
        data.articles.forEach(article => {
            const articleElement = document.createElement('div');
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}">Read more</a>
                <hr>
            `;
            newsDiv.appendChild(articleElement);
        });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Fetch news when the page loads
document.addEventListener('DOMContentLoaded', fetchNews);

*/
// Set the interval for fetching news every 45 minutes (in milliseconds)
const FETCH_INTERVAL = 600 * 60 * 1000; // 45 minutes in milliseconds
const DISPLAY_INTERVAL = 50000; // Time to cycle through the news every 50 seconds
const NEWS_BATCH_SIZE = 5; // Display 5 news items at a time

let newsData = []; // Store fetched news articles globally
let currentBatchStartIndex = 0; // Track the current batch of news items

// Function to fetch Node.js related news
async function fetchNews() {
    try {
        const response = await fetch('https://api.goperigon.com/v1/all?apiKey=0b0372a3-66fc-499e-9b77-55827765eba4&title=node.js');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data); // Debugging: check if the data is being fetched

        const newsDiv = document.getElementById('news');
        newsDiv.innerHTML = ''; // Clear existing news before adding new ones

        data.articles.forEach(article => {
            const articleElement = document.createElement('li'); // Changed to 'li'
            articleElement.classList.add('list-group-item');
            articleElement.innerHTML = `
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${article.url}" target="_blank">Read more</a>
                <hr>
            `;
            newsDiv.appendChild(articleElement);
        });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Function to display a batch of 5 news items with a fade effect
async function fetchNews() {
    try {
        const response = await fetch('https://api.goperigon.com/v1/all?apiKey=YOUR_API_KEY&title=node.js');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        let start = 0;
        const newsDiv = document.getElementById('news');
        const displayNews = () => {
            newsDiv.innerHTML = '';  // Clear current news
            const articles = data.articles.slice(start, start + 5);  // Get 5 articles at a time
            articles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <p>${article.description}</p>
                    <a href="${article.url}">Read more</a>
                    <hr>
                `;
                newsDiv.appendChild(articleElement);
            });
            start = (start + 5) % data.articles.length;  // Cycle through the articles
        };
        displayNews();  // Initial display
        setInterval(displayNews, 5000);  // Update every 50 seconds
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchNews);