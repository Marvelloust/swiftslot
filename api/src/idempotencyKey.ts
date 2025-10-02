// src/models/idempotencyKey.ts
import { DataTypes, Model } from 'sequelize';
const { sequelize } = require('./config/db');

export class IdempotencyKey extends Model {
  public key!: string;
  public scope!: string;
  public response_hash!: string;
  public created_at!: Date;
}

IdempotencyKey.init(
  {
    key: { type: DataTypes.STRING, primaryKey: true },
    scope: { type: DataTypes.STRING },
    response_hash: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'idempotency_keys',
    modelName: 'IdempotencyKey',
    timestamps: false,
  }
);
