import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

import AllRooms from './pages/AllRooms';

import SearchResults from './pages/SearchResults';
import HotelDetails from './pages/HotelDetails';
import CheckoutPage from './pages/CheckoutPage'; 
import WishlistPage from './pages/WishlistPage'; 
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import InvoicePage from './pages/InvoicePage'; // 1. Direct Invoice Page import

// --- Auth Pages ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// --- AI ChatBot Import ---
import AIChatBot from './components/AIChatBot';

function App() {
  const location = useLocation();
  const isInvoiceRoute = location.pathname.startsWith('/invoice');

  return (
    <div className="bg-[#0A0A0A] min-h-screen font-sans antialiased selection:bg-[#C6A675] selection:text-black">
      {/* Invoice pass view par main header hide rahega */}
      {!isInvoiceRoute && <Header />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/checkout" element={<CheckoutPage />} /> 
          <Route path="/wishlist" element={<WishlistPage />} /> 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookings" element={<BookingsPage />} />

          {/* 2. Dedicated Standalone Luxury Voucher Route */}
          <Route path="/invoice/:bookingId" element={<InvoicePage />} />

          {/* --- Actual Auth Routes --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="pt-40 text-white text-center h-screen">
              <h1 className="text-6xl font-serif text-[#C6A675] mb-4">404</h1>
              <p className="text-white/40 uppercase tracking-widest text-xs">Destination not found.</p>
            </div>
          } />
        </Routes>
      </main>

      {/* Invoice pass view par footer hide rahega */}
      {!isInvoiceRoute && <Footer />}
    </div>
  );
}

export default App;