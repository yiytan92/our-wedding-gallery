import React, { useState } from 'react';


const guestList = require("../data/guests.json")

const SeatingArrangement = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const searchQuery = query.toLowerCase().trim();
    const guest = guestList.find(g => {
      const guestName = g.name.toLowerCase();
      // Check for substring match or if guest name contains the query
      return guestName.includes(searchQuery) || searchQuery.includes(guestName);
    });
    setResult(guest ? `${guest.name} ${guest.table}` : 'Guest not found');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Find Your Table</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your name"
        style={{
          padding: '10px',
          marginRight: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
      <button onClick={handleSearch} style={{
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '4px',
        backgroundColor: '#cc8b79',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        Search
      </button>
      {result && <p style={{ marginTop: '20px', fontSize: '18px' }}>{result}</p>}
    </div>
  );
};

export default SeatingArrangement;
