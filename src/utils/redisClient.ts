import Redis from 'ioredis';
import { Request, Response, NextFunction } from 'express';

// i use to connect he redis
export const redisClient = new Redis("rediss://default:AU9gAAIjcDFlMTZjMTg4ODYyNDI0YjhkYjgzZjViZjI0YzVkNWRiM3AxMA@pumped-mastodon-20320.upstash.io:6379");

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = `properties:${req.method}:${req.url}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      redisClient.setex(key, 3600, JSON.stringify(body)).catch(err => console.error('Redis set error:', err));
      return originalJson(body);
    };

    next();
  } catch (err) {
    console.error("Redis error:", err);
    next();
  }
}

export async function clearCache(pattern: string) {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error("Redis clear error:", err);
  }
}

export default redisClient;