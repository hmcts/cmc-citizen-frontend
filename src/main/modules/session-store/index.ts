import * as config from 'config'
import RedisStore from 'connect-redis'
import * as session from 'express-session'
import Redis from 'ioredis'

export interface SessionRedisConfig {
  url?: string
  host?: string
  port?: number
  key?: string
  tls?: boolean
}

/**
 * Returns an express-session store: Redis when REDISCLOUD_URL or session.redis is configured,
 * otherwise MemoryStore (for local/dev and mocha).
 * Aligned with civil-citizen-ui: https://github.com/hmcts/civil-citizen-ui
 */
export function getSessionStore (): session.Store {
  const redisUrl = process.env.REDISCLOUD_URL || (config.has('session.redis.url') && config.get<string>('session.redis.url'))
  const useRedis = config.has('session.useRedisStore') && config.get<boolean>('session.useRedisStore')

  if (redisUrl && redisUrl.length > 0) {
    const client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      tls: redisUrl.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    })
    return new RedisStore({
      client,
      prefix: config.has('session.name') ? `${config.get<string>('session.name')}:` : 'cmc-citizen-ui-session:',
      ttl: config.has('session.cookieMaxAge') ? Math.floor(config.get<number>('session.cookieMaxAge') / 1000) : 86400
    })
  }

  if (useRedis) {
    const redis = config.get<SessionRedisConfig>('session.redis')
    const protocol = redis?.tls ? 'rediss://' : 'redis://'
    const auth = redis?.key ? `:${redis.key}@` : ''
    const connectionString = `${protocol}${auth}${redis?.host || 'localhost'}:${redis?.port || 6379}`
    const client = new Redis(connectionString, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      tls: redis?.tls ? { rejectUnauthorized: false } : undefined
    })
    return new RedisStore({
      client,
      prefix: config.has('session.name') ? `${config.get<string>('session.name')}:` : 'cmc-citizen-ui-session:',
      ttl: config.has('session.cookieMaxAge') ? Math.floor(config.get<number>('session.cookieMaxAge') / 1000) : 86400
    })
  }

  return new session.MemoryStore()
}
