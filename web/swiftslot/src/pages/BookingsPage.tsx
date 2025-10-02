import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { toLagosTime } from '../utils/dateUtils';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Search, RefreshCw, Package } from 'lucide-react';

type Booking = {
    id: number;
    start_time_utc: string;
    end_time_utc: string;
    status: 'pending' | 'paid' | 'confirmed' | 'cancelled';
    vendor_id: number;
    vendor_name: string;
    created_at?: string;
};

type FilterType = 'all' | 'paid' | 'pending' | 'cancelled';

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FilterType>('all');
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);

        try {
            const response = await fetch('http://localhost:3001/api/bookings');
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
            if (showRefresh) setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusConfig = (status: string) => {
        const config = {
            pending: {
                color: 'bg-yellow-500',
                textColor: 'text-yellow-700',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                label: 'Pending'
            },
            paid: {
                color: 'bg-green-500',
                textColor: 'text-green-700',
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                label: 'Confirmed'
            },
            confirmed: {
                color: 'bg-blue-500',
                textColor: 'text-blue-700',
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                label: 'Confirmed'
            },
            cancelled: {
                color: 'bg-red-500',
                textColor: 'text-red-700',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                label: 'Cancelled'
            }
        };
        return config[status as keyof typeof config] || config.pending;
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toString().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getBookingStats = () => {
        const total = bookings.length;
        const paid = bookings.filter(b => b.status === 'paid' || b.status === 'confirmed').length;
        const pending = bookings.filter(b => b.status === 'pending').length;
        const cancelled = bookings.filter(b => b.status === 'cancelled').length;

        return { total, paid, pending, cancelled };
    };

    const stats = getBookingStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="mb-8 animate-pulse">
                        <div className="h-8 w-48 bg-sky-200 rounded mb-2"></div>
                        <div className="h-4 w-64 bg-sky-100 rounded"></div>
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 animate-pulse">
                                <div className="h-6 w-20 bg-sky-200 rounded mb-2"></div>
                                <div className="h-8 w-12 bg-sky-300 rounded"></div>
                            </div>
                        ))}
                    </div>

                    {/* Booking Cards Skeleton */}
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 animate-pulse">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-sky-200 rounded-xl"></div>
                                        <div>
                                            <div className="h-5 w-32 bg-sky-200 rounded mb-2"></div>
                                            <div className="h-4 w-24 bg-sky-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-24 bg-sky-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <Link to="/">
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2 cursor-pointer">
                                    My Bookings
                                </h1>
                            </Link>
                            <p className="text-gray-600">Manage and track all your appointments</p>
                        </div>

                        <button
                            onClick={() => fetchBookings(true)}
                            disabled={refreshing}
                            className="flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-xl font-semibold hover:bg-sky-50 transition-all duration-300 shadow-lg border border-sky-200"
                        >
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-sky-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Bookings</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Confirmed</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.paid}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Cancelled</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.cancelled}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search by vendor name or booking ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-300"
                                />
                            </div>

                            <div className="flex gap-2">
                                {(['all', 'paid', 'pending', 'cancelled'] as FilterType[]).map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setStatusFilter(filter)}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${statusFilter === filter
                                            ? 'bg-sky-600 text-white shadow-lg'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bookings List */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="w-10 h-10 text-sky-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No bookings found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No bookings match your current filters. Try adjusting your search criteria.'
                                : "You haven't made any bookings yet. Start by browsing available vendors."
                            }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Link
                                to="/vendors"
                                className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Browse Vendors
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        {filteredBookings.map((booking, index) => {
                            const lagosTime = toLagosTime(booking.start_time_utc);
                            const lagosStr = format(lagosTime, 'MMM dd, yyyy • h:mm a');
                            const relativeTime = formatDistanceToNow(lagosTime, { addSuffix: true });
                            const statusConfig = getStatusConfig(booking.status);

                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-2xl p-6 shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 hover:border-sky-200 group"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                {booking.vendor_name?.charAt(0) || 'V'}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-sky-700 transition-colors">
                                                        {booking.vendor_name || `Vendor #${booking.vendor_id}`}
                                                    </h3>
                                                    <span className={`px-3 py-1 ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} text-sm font-semibold rounded-full`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{lagosStr}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{relativeTime}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>Booking #{booking.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/bookings/${booking.id}`}
                                            className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg hover:shadow-xl group/view"
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4 group-hover/view:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
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
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
        </div>
    );
}