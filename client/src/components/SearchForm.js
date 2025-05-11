import React, { useState } from 'react';

function SearchForm({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [targetDomain, setTargetDomain] = useState('kollegeapply.com');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearch(keyword.trim(), targetDomain.trim() || 'kollegeapply.com');
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="keyword">Search Keyword (e.g., college name):</label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter college name or keyword"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="targetDomain">Target Domain (default: kollegeapply.com):</label>
        <input
          type="text"
          id="targetDomain"
          value={targetDomain}
          onChange={(e) => setTargetDomain(e.target.value)}
          placeholder="kollegeapply.com"
        />
      </div>
      
      <button type="submit" className="search-button">Check Rank</button>
    </form>
  );
}

export default SearchForm;