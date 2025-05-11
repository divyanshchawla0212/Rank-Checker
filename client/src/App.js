// // src/App.js
// import React, { useState, useEffect } from 'react';
// import './App.css';
// import SearchForm from './components/SearchForm';
// import Results from './components/Results';
// import SearchHistory from './components/SearchHistory';
// import Loading from './components/Loading';

// function App() {
//   const [activeTab, setActiveTab] = useState('search');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchResult, setSearchResult] = useState(null);
//   const [searchHistory, setSearchHistory] = useState([]);

//   // Load search history from localStorage on component mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('rankSearchHistory');
//     if (savedHistory) {
//       setSearchHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Save search history to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('rankSearchHistory', JSON.stringify(searchHistory));
//   }, [searchHistory]);

//   const handleSearch = async (keyword, targetDomain) => {
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await fetch('http://localhost:5000/api/search', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ keyword, targetDomain }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Server error');
//       }
      
//       const data = await response.json();
      
//       // Add timestamp to result
//       const resultWithTimestamp = {
//         ...data,
//         timestamp: new Date().toISOString(),
//       };
      
//       setSearchResult(resultWithTimestamp);
      
//       // Add to search history
//       setSearchHistory(prevHistory => {
//         const newHistory = [resultWithTimestamp, ...prevHistory];
//         // Limit history to 20 items
//         return newHistory.slice(0, 20);
//       });
      
//     } catch (err) {
//       setError(err.message);
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearHistory = () => {
//     setSearchHistory([]);
//     localStorage.removeItem('rankSearchHistory');
//   };

//   const handleHistoryItemClick = (item) => {
//     setSearchResult(item);
//     setActiveTab('search');
//   };

//   return (
//     <div className="App">
//       <div className="container">
//         <h1>Website Rank Checker</h1>
        
//         <div className="tabs">
//           <div 
//             className={`tab ${activeTab === 'search' ? 'active' : ''}`}
//             onClick={() => setActiveTab('search')}
//           >
//             Search
//           </div>
//           <div 
//             className={`tab ${activeTab === 'history' ? 'active' : ''}`}
//             onClick={() => setActiveTab('history')}
//           >
//             History
//           </div>
//         </div>
        
//         <div className={`tab-content ${activeTab === 'search' ? 'active' : ''}`}>
//           <SearchForm onSearch={handleSearch} />
          
//           {loading && <Loading />}
          
//           {error && (
//             <div className="error-message">
//               {error}
//             </div>
//           )}
          
//           {searchResult && !loading && <Results result={searchResult} />}
//         </div>
        
//         <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
//           <h2>Search History</h2>
//           <SearchHistory 
//             history={searchHistory} 
//             onItemClick={handleHistoryItemClick}
//             onClearHistory={clearHistory}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import Results from './components/Results';
import SearchHistory from './components/SearchHistory';
import Loading from './components/Loading';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  
  // API URL - making it a constant for easier configuration
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/search';

  // Load search history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('rankSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Error loading search history:', err);
      // If there's an error with the stored data, clear it
      localStorage.removeItem('rankSearchHistory');
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('rankSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (keyword, targetDomain = 'collegedunia.com') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword, targetDomain }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error');
      }
      
      const data = await response.json();
      
      // Add timestamp to result
      const resultWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString(),
      };
      
      setSearchResult(resultWithTimestamp);
      
      // Add to search history
      setSearchHistory(prevHistory => {
        const newHistory = [resultWithTimestamp, ...prevHistory];
        // Limit history to 20 items
        return newHistory.slice(0, 20);
      });
      
    } catch (err) {
      setError(err.message || 'An error occurred during the search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('rankSearchHistory');
  };

  const handleHistoryItemClick = (item) => {
    setSearchResult(item);
    setActiveTab('search');
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Website Rank Checker for KOLLEGEAPPLY</h1>
        
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search
          </div>
          <div 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </div>
        </div>
        
        <div className={`tab-content ${activeTab === 'search' ? 'active' : ''}`}>
          <SearchForm onSearch={handleSearch} defaultDomain="kollegeapply.com" />
          
          {loading && <Loading />}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {searchResult && !loading && <Results result={searchResult} />}
        </div>
        
        <div className={`tab-content ${activeTab === 'history' ? 'active' : ''}`}>
          <h2>Search History</h2>
          <SearchHistory 
            history={searchHistory} 
            onItemClick={handleHistoryItemClick}
            onClearHistory={clearHistory}
          />
        </div>
      </div>
    </div>
  );
}

export default App;