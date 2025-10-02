import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Check, Clock, AlertCircle, Calendar, User, RefreshCw, ArrowLeft } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

type Booking = {
  id: number;
  status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
  start_time_utc: string;
  end_time_utc: string;
  vendor_id: number;
  vendor_name?: string;
  created_at?: string;
};

export default function BookingStatusPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchBooking = () => {
    setLoading(true);
    fetch(`http://localhost:3001/api/bookings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Booking not found');
        return res.json();
      })
      .then((data) => {
        setBooking(data);
        setLoading(false);
        setLastUpdated(new Date().toISOString());
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooking();
    
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchBooking, 30000);
    return () => clearInterval(interval);
  }, [id]);

  const getStatusConfig = (status: string) => {
    const config = {
      pending: {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: Clock,
        label: 'Pending Payment',
        description: 'Waiting for payment confirmation'
      },
      paid: {
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: Check,
        label: 'Confirmed',
        description: 'Booking confirmed and paid'
      },
      confirmed: {
        color: 'bg-blue-500',
        textColor: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: Check,
        label: 'Confirmed',
        description: 'Booking confirmed'
      },
      cancelled: {
        color: 'bg-red-500',
        textColor: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertCircle,
        label: 'Cancelled',
        description: 'Booking has been cancelled'
      }
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const formatDateTime = (utcString: string) => {
    const date = new Date(utcString);
    return {
      date: format(date, 'EEEE, MMMM do yyyy'),
      time: format(date, 'h:mm a'),
      relative: formatDistanceToNow(date, { addSuffix: true })
    };
  };

  if (loading && !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-6 w-32 bg-sky-200 rounded mb-4"></div>
            <div className="h-10 w-64 bg-sky-200 rounded"></div>
          </div>

          {/* Status Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100 mb-6 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-sky-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 w-48 bg-sky-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-sky-100 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-sky-200 rounded mb-1"></div>
                    <div className="h-4 w-32 bg-sky-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <a 
            href="/bookings" 
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 transition-colors group font-semibold"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Bookings
          </a>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Booking Details
              </h1>
              <p className="text-gray-600">Track your appointment status and details</p>
            </div>
            
            <button
              onClick={fetchBooking}
              disabled={loading}
              className="flex items-center gap-2 text-sky-600 hover:text-sky-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 animate-shake">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 text-lg mb-1">Unable to Load Booking</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {booking && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100 animate-slide-up">
              <div className="flex items-center gap-4 mb-6">
                {(() => {
                  const statusConfig = getStatusConfig(booking.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <>
                      <div className={`w-16 h-16 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}>
                        <StatusIcon className={`w-8 h-8 ${statusConfig.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-800">{statusConfig.label}</h2>
                          <span className={`px-3 py-1 ${statusConfig.color} text-white text-sm font-semibold rounded-full`}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600">{statusConfig.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-sky-50 rounded-xl">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vendor</p>
                      <p className="font-semibold text-gray-800">
                        {booking.vendor_name || `Vendor #${booking.vendor_id}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Start Time</p>
                      <p className="font-semibold text-gray-800">
                        {formatDateTime(booking.start_time_utc).date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(booking.start_time_utc).time} (UTC)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-mono font-bold text-gray-800 text-lg">#{booking.id}</p>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">End Time</p>
                      <p className="font-semibold text-gray-800">
                        {formatDateTime(booking.end_time_utc).date}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(booking.end_time_utc).time} (UTC)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Booking Timeline</h3>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p>Created</p>
                    <p className="font-medium">
                      {booking.created_at ? formatDateTime(booking.created_at).relative : 'Recently'}
                    </p>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                  <div className="text-center">
                    <div className={`w-3 h-3 ${booking.status === 'paid' || booking.status === 'confirmed' ? 'bg-green-500' : 'bg-gray-300'} rounded-full mx-auto mb-2`}></div>
                    <p>Confirmed</p>
                    <p className="font-medium">
                      {(booking.status === 'paid' || booking.status === 'confirmed') ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-sky-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <h3 className="font-semibold text-gray-800 mb-4">Booking Actions</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-sky-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View Vendor Details
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                  Reschedule Booking
                </button>
                <button className="flex-1 border border-red-300 text-red-600 py-3 px-6 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300">
                  Cancel Booking
                </button>
              </div>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Last updated {formatDistanceToNow(new Date(lastUpdated))} ago
                </p>
              </div>
            )}
          </div>
        )}
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