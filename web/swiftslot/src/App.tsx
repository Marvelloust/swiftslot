import { Route, Routes, Navigate } from 'react-router-dom';
import VendorsPage from './pages/VendorsPage';
import VendorDetailPage from './pages/VendorDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingStatusPage from './pages/BookingStatusPage';
import BookingsPage from './pages/BookingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/vendors" />} />
      <Route path="/vendors" element={<VendorsPage />} />
      <Route path="/vendors/:id" element={<VendorDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/bookings/:id" element={<BookingStatusPage />} />
      <Route path="/bookings" element={<BookingsPage />} />
    </Routes>
  );
}
