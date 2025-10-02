import { useBookingStore } from '../store/bookingStore';
import { toLagosTime } from '../utils/dateUtils';
import { format } from 'date-fns';
import { useState } from 'react';
import { Check, Clock, AlertCircle, CreditCard, Shield } from 'lucide-react';

export default function CheckoutPage() {
    const { vendor, selectedSlotUtc } = useBookingStore();
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);

    if (!vendor || !selectedSlotUtc) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No Slot Selected</h2>
                    <p className="text-gray-600 mb-6">Please select a vendor and time slot before proceeding to checkout.</p>
                    <a
                        href="/vendors"
                        className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                        Browse Vendors
                    </a>
                </div>
            </div>
        );
    }

    const lagosTime = toLagosTime(selectedSlotUtc);
    const lagosTimeStr = format(lagosTime, 'EEEE, MMMM do yyyy • HH:mm');
    // const lagosTimeShort = format(lagosTime, 'HH:mm');

    const handleBooking = async () => {
        setBookingStatus('processing');
        setError(null);

        try {
            // 1. Book the slot
            const idempotencyKey = Math.random().toString(36).substring(2);
            const bookingRes = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Idempotency-Key': idempotencyKey,
                },
                body: JSON.stringify({
                    vendor_id: vendor.id,
                    start_time_local: selectedSlotUtc,
                }),
            });

            if (!bookingRes.ok) {
                let errMsg = 'Booking failed';
                try {
                    const err = await bookingRes.json();
                    if (err.error === 'Slot already booked') {
                        errMsg = 'Sorry, this slot has just been booked by someone else. Please pick another.';
                    } else {
                        errMsg = err.error || errMsg;
                    }
                } catch {
                    // Intentionally ignore JSON parse errors
                }
                throw new Error(errMsg);
            }

            const booking = await bookingRes.json();
            setBookingId(booking.id);

            // 2. Initialize payment
            const payRes = await fetch('http://localhost:3001/api/payments/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_id: booking.id }),
            });
            if (!payRes.ok) {
                let errMsg = 'Payment initialization failed';
                try {
                    const err = await payRes.json();
                    if (err.error) {
                        errMsg = err.error;
                    }
                } catch {
                    // Intentionally ignore JSON parse errors
                }
                throw new Error(errMsg);
            }

            const payData = await payRes.json();
            console.log('payData from /api/payments/initialize:', payData);
            const ref = payData.ref;
            if (!ref) throw new Error('Payment reference missing from server response.');

            // 3. Simulate webhook
            console.log('Sending webhook with ref:', ref);
            const webhookRes = await fetch('http://localhost:3001/api/payments/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ref, // match backend expectation
                    event: {
                        type: 'mock.payment_success',
                        amount: 5000,
                    },
                }),
            });
            if (!webhookRes.ok) {
                let errMsg = 'Payment webhook failed';
                try {
                    const err = await webhookRes.json();
                    if (err.error) {
                        errMsg = err.error;
                    }
                } catch {
                    // Intentionally ignore JSON parse errors
                }
                throw new Error(errMsg);
            }

            setBookingStatus('success');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setBookingStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <a href="/vendors" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Back to vendors
                    </a>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Checkout
                    </h1>
                    <p className="text-gray-600">Complete your booking with secure payment</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Summary */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100 animate-slide-up">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-sky-600" />
                                </div>
                                Booking Summary
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                                        <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                            {vendor.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Vendor</p>
                                            <p className="font-semibold text-gray-800">{vendor.name}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <p className="text-sm text-gray-600 mb-1">Scheduled Time</p>
                                        <p className="font-bold text-green-800 text-lg">{lagosTimeStr}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            UTC: <span className="font-mono">{selectedSlotUtc}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <p className="text-sm text-gray-600 mb-1">Price</p>
                                        <p className="text-2xl font-bold text-amber-700">₦5,000</p>
                                        <p className="text-xs text-amber-600">Mock payment for demonstration</p>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-600">Secure SSL encrypted payment</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Security */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <h3 className="font-semibold text-gray-800 mb-4">Payment Security</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Shield className="w-4 h-4 text-green-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">SSL Secure</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">PCI Compliant</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Check className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">Instant Confirmation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel - 1/3 width */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-sky-200 p-6 sticky top-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
                                Complete Booking
                            </h3>

                            {bookingStatus === 'idle' || bookingStatus === 'error' ? (
                                <button
                                    onClick={handleBooking}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Book & Pay ₦5,000
                                </button>
                            ) : bookingStatus === 'processing' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Processing Payment</h4>
                                    <p className="text-sm text-gray-600 animate-pulse">
                                        Securing your booking...
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                            <span>Creating booking</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                            <span>Processing payment</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                                            <span>Confirming reservation</span>
                                        </div>
                                    </div>
                                </div>
                            ) : bookingStatus === 'success' ? (
                                <div className="text-center py-6 animate-fade-in">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h4 className="text-xl font-bold text-green-800 mb-2">Booking Confirmed!</h4>
                                    <p className="text-gray-600 mb-4">
                                        Your payment has been processed successfully
                                    </p>
                                    <div className="bg-green-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-600">Booking ID</p>
                                        <p className="font-mono font-bold text-green-800 text-lg">{bookingId}</p>
                                    </div>
                                    <a
                                        href={`/bookings/${bookingId}`}
                                        className="w-full bg-sky-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl block text-center"
                                    >
                                        View Booking Details
                                    </a>
                                </div>
                            ) : null}

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-red-800 text-sm">Booking Failed</p>
                                            <p className="text-red-700 text-sm mt-1">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                    <span>🔒 Secure</span>
                                    <span>•</span>
                                    <span>⚡ Instant</span>
                                    <span>•</span>
                                    <span>🔄 Protected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add custom animations to global CSS */}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}