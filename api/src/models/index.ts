const { Vendor } = require('./vendor');
const { Booking } = require('./booking');
const { BookingSlot } = require('./bookingSlot');
const { Payment } = require('./payment');

// Associations
Booking.belongsTo(Vendor, { foreignKey: 'vendor_id' });
Booking.hasMany(BookingSlot, { foreignKey: 'booking_id' });
Booking.hasOne(Payment, { foreignKey: 'booking_id' });

BookingSlot.belongsTo(Booking, { foreignKey: 'booking_id' });
