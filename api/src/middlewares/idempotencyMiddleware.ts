import { Request, Response, NextFunction } from 'express';
import { IdempotencyKey } from '../models/idempotencyKey';

export function idempotencyMiddleware(scope: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers['idempotency-key'];

    if (!key || typeof key !== 'string') {
      return res.status(400).json({ error: 'Missing Idempotency-Key header' });
    }

    const existing = await IdempotencyKey.findByPk(key);
    if (existing) {
      try {
        const data = JSON.parse(existing.response_hash);
        return res.status(200).json(data);
      } catch {
        return res.status(409).json({ error: 'Idempotency conflict' });
      }
    }

    // Store the response after sending
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      IdempotencyKey.create({
        key,
        scope,
        response_hash: JSON.stringify(body),
      });
      return originalJson(body);
    };

    next();
  };
}
