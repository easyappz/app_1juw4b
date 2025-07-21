import React, { useState } from 'react';
import './App.css';
import PhotoRating from './components/PhotoRating';
import FilterPanel from './components/FilterPanel';

function App() {
  const [filters, setFilters] = useState({ gender: '', minAge: '', maxAge: '' });

  return (
    <div className="App" style={{ padding: '20px', margin: '0 auto', maxWidth: '800px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Оценка фотографий</h1>
      <FilterPanel onFilterChange={setFilters} filters={filters} />
      <PhotoRating filters={filters} />
    </div>
  );
}

export default App;
