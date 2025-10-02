// src/models/payment.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export class Payment extends Model {}

Payment.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    booking_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    ref: { type: DataTypes.STRING, unique: true, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid'), defaultValue: 'pending' },
    raw_event_json: { type: DataTypes.JSON },
  },
  {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
    timestamps: false,
  }
);
