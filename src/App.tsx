import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <Link to="/" className="font-bold">
            E-Stay
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<HotelList />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
        </Routes>
      </main>
    </div>
  );
}
