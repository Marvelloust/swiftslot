import { useEffect, useState } from 'react';

type Vendor = {
  id: number;
  name: string;
  timezone: string;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/vendors')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch vendors');
        }
        return res.json();
      })
      .then((data) => {
        setVendors(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch vendors:', error);
        setError('Unable to load vendors. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8 p-4">
            <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              SwiftSlot
            </h1>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sky-700 font-medium">Loading vendors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              SwiftSlot
            </h1>
          </div>
          <div className="text-sm text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            {vendors.length} vendors available
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">!</span>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-sky-100 hover:border-sky-200 group"
            >
              {/* Vendor Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-sky-700 transition-colors">
                    {vendor.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {vendor.timezone}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {vendor.name.charAt(0)}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`/vendors/${vendor.id}`}
                className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg block group"
              >
                See Availability
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {vendors.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No vendors available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are currently no vendors available for booking. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}