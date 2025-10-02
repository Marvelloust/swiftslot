// src/models/booking.ts
import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./config/db');

export class Booking extends Model {
  public id!: number;
  public vendor_id!: number;
  public buyer_id!: number;
  public start_time_utc!: Date;
  public end_time_utc!: Date;
  public status!: 'pending' | 'paid';
  public readonly created_at!: Date;
}

Booking.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    vendor_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    buyer_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    start_time_utc: { type: DataTypes.DATE, allowNull: false },
    end_time_utc: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid'), defaultValue: 'pending' },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },
  {
    sequelize,
    tableName: 'bookings',
    modelName: 'Booking',
    timestamps: false,
  }
);
