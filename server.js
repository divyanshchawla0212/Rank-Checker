const express = require('express');
const { getJson } = require('serpapi');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Your SerpAPI key
const API_KEY = '3fa9c00246f75d9fe820bdc665116490ca88504f2fe11c350c3af9f65bc4e20b';

const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(API_KEY);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Function to search Google and find the rank of a specific website
// async function findWebsiteRank(keyword, targetDomain) {
//   try {
//     // Make request to SerpAPI
//     const response = await getJson({
//       engine: "google",
//       q: keyword,
//       api_key: API_KEY,
//       num: 1000 // Request 1000 results instead of 100
//     });

//     // Get organic results
//     const organicResults = response.organic_results || [];
    
//     // Find the rank of the target domain
//     let rank = -1;
//     let foundUrl = null;
    
//     for (let i = 0; i < organicResults.length; i++) {
//       const result = organicResults[i];
//       if (result.link && result.link.includes(targetDomain)) {
//         rank = i + 1; // +1 because array indices start at 0
//         foundUrl = result.link;
//         break;
//       }
//     }

//     return {
//       keyword,
//       targetDomain,
//       rank: rank !== -1 ? rank : 'Not found in top 1000 results', // Updated message
//       totalResults: organicResults.length,
//       url: foundUrl
//     };
//   } catch (error) {
//     console.error('Error searching with SerpAPI:', error.message);
//     return {
//       keyword,
//       targetDomain,
//       rank: 'Error in search',
//       error: error.message
//     };
//   }
// }

async function findWebsiteRank(keyword, targetDomain) {
  return new Promise((resolve, reject) => {
    search.json({
      engine: "google",
      q: keyword,
      num: 500
    }, (response) => {
      try {
        const organicResults = response.organic_results || [];

        let rank = -1;
        let foundUrl = null;

        for (let i = 0; i < 500; i++) {
          const result = organicResults[i];
          if (result.link && result.link.includes(targetDomain)) {
            rank = i + 1;
            foundUrl = result.link;
            break;
          }
        }

        resolve({
          keyword,
          targetDomain,
          rank: rank !== -1 ? rank : 'Not found in top results',
          totalResults: organicResults.length,
          url: foundUrl
        });
      } catch (err) {
        reject({
          keyword,
          targetDomain,
          rank: 'Error in parsing',
          error: err.message
        });
      }
    });
  });
}
// API endpoint to search and get rank
app.post('/api/search', async (req, res) => {
  const { keyword, targetDomain = 'kollegeapply.com' } = req.body;
  
  if (!keyword) {
    return res.status(400).json({ error: 'Keyword is required' });
  }

  try {
    const result = await findWebsiteRank(keyword, targetDomain);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;