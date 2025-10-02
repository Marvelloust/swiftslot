// src/models/bookingSlot.ts
import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./config/db');

export class BookingSlot extends Model {
  public id!: number;
  public booking_id!: number;
  public vendor_id!: number;
  public slot_start_utc!: Date;
}

BookingSlot.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    booking_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    vendor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    slot_start_utc: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    tableName: 'booking_slots',
    modelName: 'BookingSlot',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['vendor_id', 'slot_start_utc'],
      },
    ],
  }
);
