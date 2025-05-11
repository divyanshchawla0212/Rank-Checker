import React from 'react';

function Results({ result }) {
  let statusClass = 'not-found';
  let statusEmoji = '❌';
  
  if (result.rank && result.rank !== 'Not found in top 100 results' && result.rank !== 'Error in search') {
    statusClass = result.rank <= 10 ? 'high-rank' : 'found';
    statusEmoji = result.rank <= 10 ? '🏆' : '✅';
  }

  return (
    <div className="result-card">
      <div className={`result-header ${statusClass}`}>
        <h3>{statusEmoji} {result.keyword}</h3>
        <span className="timestamp">{new Date(result.timestamp).toLocaleString()}</span>
      </div>
      <div className="result-content">
        <p><strong>Domain:</strong> {result.targetDomain}</p>
        <p><strong>Rank:</strong> <span className={`rank ${statusClass}`}>{result.rank}</span></p>
        {result.url && (
          <p>
            <strong>URL:</strong>{' '}
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
          </p>
        )}
        {result.totalResults && (
          <p><strong>Total Results:</strong> {result.totalResults}</p>
        )}
      </div>
    </div>
  );
}

export default Results;