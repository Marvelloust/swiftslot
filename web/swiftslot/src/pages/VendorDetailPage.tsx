import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { format } from 'date-fns';
import { toLagosTime } from '../utils/dateUtils';

export default function VendorDetailPage() {
  const { id } = useParams();
  const {
    vendor,
    selectedDate,
    setVendor,
    setDate,
    selectedSlotUtc,
    setSlot,
  } = useBookingStore();

  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch vendor details
    setVendorLoading(true);
    fetch(`http://localhost:3001/api/vendors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch vendor');
        return res.json();
      })
      .then((data) => {
        setVendor(data);
        setVendorLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching vendor:', error);
        setError('Unable to load vendor details');
        setVendorLoading(false);
      });
  }, [id, setVendor]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/api/vendors/${id}/availability?date=${selectedDate}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch availability');
        return res.json();
      })
      .then((data) => {
        setSlots(data.available_slots || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching slots:', error);
        setError('Unable to load available slots');
        setLoading(false);
      });
  }, [id, selectedDate]);

  // Set default date to today if not set
  useEffect(() => {
    if (!selectedDate) {
      setDate(format(new Date(), 'yyyy-MM-dd'));
    }
  }, [selectedDate, setDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/vendors" className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-4 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to vendors
          </a>
          
          {vendorLoading ? (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-200 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-6 w-48 bg-sky-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-32 bg-sky-100 rounded animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {vendor?.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-sky-200 shadow-sm">
                    {vendor?.timezone} Timezone
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {vendor?.name?.charAt(0)}
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                📅 Select Date
              </label>
              <input
                type="date"
                className="w-full border-2 border-sky-100 p-4 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300 text-lg font-medium"
                value={selectedDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Available Slots */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>🕒 Available Slots</span>
                {!loading && slots.length > 0 && (
                  <span className="text-sm font-normal text-sky-600 bg-sky-100 px-2 py-1 rounded-full">
                    {slots.length} slots
                  </span>
                )}
              </h2>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">!</span>
                    </div>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-14 bg-sky-100 rounded-xl animate-pulse"
                    ></div>
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No slots available
                  </h3>
                  <p className="text-gray-500">
                    {selectedDate ? 'No available slots for this date. Try another date.' : 'Please select a date to see available slots.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
                  {slots.map((slot, index) => {
                    const local = toLagosTime(slot);
                    const timeStr = format(local, 'HH:mm');
                    const isSelected = selectedSlotUtc === slot;

                    return (
                      <button
                        key={slot}
                        onClick={() => setSlot(slot)}
                        className={`
                          relative p-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-105 border-2
                          ${
                            isSelected
                              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-sky-600 shadow-lg scale-105'
                              : 'bg-white text-gray-700 border-sky-100 hover:border-sky-300 hover:shadow-md'
                          }
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {timeStr}
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Review Panel - 1/3 width */}
          <div className="lg:col-span-1">
            {selectedSlotUtc && (
              <div className="bg-white rounded-2xl shadow-xl border border-sky-200 p-6 sticky top-6 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>✅ Selected Slot</span>
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-sky-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">UTC Time</p>
                    <p className="font-mono font-bold text-gray-800 text-lg">
                      {selectedSlotUtc}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Lagos Time</p>
                    <p className="font-mono font-bold text-gray-800 text-lg">
                      {format(toLagosTime(selectedSlotUtc), 'HH:mm')}
                    </p>
                  </div>
                </div>

                <a
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-center py-4 px-6 rounded-xl font-bold hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 block"
                >
                  Continue to Checkout
                  <span className="ml-2 animate-bounce">→</span>
                </a>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Secure booking • Instant confirmation
                </p>
              </div>
            )}
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
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}