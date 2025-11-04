import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PlannerPage from './pages/PlannerPage';
import ItineraryPage from './pages/ItineraryPage';
import MyTripsPage from './pages/MyTripsPage';
import GoogleCallbackPage from './pages/GoogleCallbackPage'; // <-- 1. IMPORT NEW PAGE
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* --- 2. ADD NEW GOOGLE CALLBACK ROUTE --- */}
              <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

              {/* Protected Routes */}
              <Route 
                path="/planner" 
                element={ <PrivateRoute> <PlannerPage /> </PrivateRoute> } 
              />
              <Route 
                path="/itinerary/:tripId" 
                element={ <PrivateRoute> <ItineraryPage /> </PrivateRoute> } 
              />
              <Route 
                path="/my-trips" 
                element={ <PrivateRoute> <MyTripsPage /> </PrivateRoute> } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

