import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <div className="page-bg min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Prediction />} />
            <Route path="/chat" element={<Chatbot />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
