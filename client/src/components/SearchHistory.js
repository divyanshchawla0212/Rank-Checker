import React from 'react';

function SearchHistory({ history, onItemClick, onClearHistory }) {
  if (history.length === 0) {
    return <p className="empty-history">No search history</p>;
  }

  return (
    <div className="history-container">
      {history.map((item, index) => {
        let statusClass = 'not-found';
        let statusEmoji = '❌';
        
        if (item.rank && item.rank !== 'Not found in top 100 results' && item.rank !== 'Error in search') {
          statusClass = item.rank <= 10 ? 'high-rank' : 'found';
          statusEmoji = item.rank <= 10 ? '🏆' : '✅';
        }

        return (
          <div 
            key={index} 
            className="history-item" 
            onClick={() => onItemClick(item)}
          >
            <div className={`history-item-header ${statusClass}`}>
              <span className="history-emoji">{statusEmoji}</span>
              <span className="history-keyword">{item.keyword}</span>
              <span className={`history-rank ${statusClass}`}>{item.rank}</span>
            </div>
            <div className="history-timestamp">
              {new Date(item.timestamp).toLocaleString()}
            </div>
          </div>
        );
      })}
      
      <button className="clear-btn" onClick={onClearHistory}>
        Clear History
      </button>
    </div>
  );
}

export default SearchHistory;