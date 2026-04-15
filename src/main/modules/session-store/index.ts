import * as config from 'config'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

const useRedisStore = config.get<boolean>('session.useRedisStore')
const redisConfig = config.get<{
  host?: string
  port?: number
  key?: string
  tls?: boolean
  keyPrefix?: string
}>('session.redis')

export interface SessionStoreOptions {
  useRedisStore?: boolean
  redis?: {
    host?: string
    port?: number
    key?: string
    tls?: boolean
    keyPrefix?: string
  }
  draftStoreAccessKey?: string
  maxAgeInMinutes?: number
  _redisFactory?: (connectionString: string, opts?: object) => { on: (event: string, fn: (err: Error) => void) => void }
  _redisStoreFactory?: (opts: { client: any; prefix: string; ttl: number }) => session.Store
}

function getRedisConnectionString (redis: typeof redisConfig, authKey: string): string {
  if (redis?.host != null && redis?.port != null) {
    const protocol = redis.tls ? 'rediss://' : 'redis://'
    // :password@ = password-only (empty username); required for Azure Redis
    return `${protocol}:${authKey}@${redis.host}:${redis.port}`
  }
  return ''
}

function getRedisAuthKey (options?: SessionStoreOptions): string {
  if (options?.draftStoreAccessKey !== undefined) return options.draftStoreAccessKey
  try {
    return config.get<string>('secrets.cmc.draft-store-access-key')
  } catch (err) {
    logger.error('Failed to read secrets.cmc.draft-store-access-key (SESSION_REDIS_KEY from Key Vault)', { error: (err as Error)?.message })
    throw err
  }
}

export function getSessionStore (options?: SessionStoreOptions): session.Store {
  const useRedis = options?.useRedisStore ?? useRedisStore
  const redis = options?.redis ?? redisConfig
  const redisAuthKey = getRedisAuthKey(options)
  const maxAgeInMinutes = options?.maxAgeInMinutes ?? config.get<number>('session.maxAgeInMinutes')

  logger.info(`[Session Store] useRedis: ${useRedis}, maxAgeInMinutes: ${maxAgeInMinutes}`)

  if (useRedis) {
    const connectionString = getRedisConnectionString(redis, redisAuthKey)
    if (!connectionString) {
      logger.error('SESSION_USE_REDIS_STORE is true but Redis is not configured. Set SESSION_REDIS_HOST and SESSION_REDIS_PORT (and SESSION_REDIS_KEY from Key Vault), or set SESSION_USE_REDIS_STORE=false for in-memory store.')
      throw new Error('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    }
    logger.info(`[Session Store] Redis connection string protocol: ${connectionString.split('://')[0]}`)
    logger.info(`[Session Store] Redis host: ${redis?.host}, port: ${redis?.port}, tls: ${redis?.tls}`)
    
    const useTls = connectionString.startsWith('rediss://') || redis?.tls === true
    const client = options?._redisFactory
      ? options._redisFactory(connectionString, { 
          maxRetriesPerRequest: undefined, 
          enableReadyCheck: true, 
          lazyConnect: false,
          tls: useTls ? { rejectUnauthorized: true } : undefined 
        })
      : new Redis(connectionString, {
          maxRetriesPerRequest: undefined,
          enableReadyCheck: true,
          lazyConnect: false,
          tls: useTls ? { rejectUnauthorized: true } : undefined
        })
    
    client.on('error', (err: Error) => {
      logger.error('Redis session store error:', err)
      logger.error(`Redis error details: ${err.message}`)
    })
    client.on('connect', () => {
      logger.info('Redis session store connected')
      logger.info(`Redis connection details - host: ${redis?.host}, port: ${redis?.port}`)
    })
    client.on('ready', () => logger.info('Redis session store ready'))
    client.on('reconnecting', () => logger.warn('Redis session store reconnecting'))
    client.on('close', () => logger.warn('Redis session store connection closed'))
    
    const store = options?._redisStoreFactory
      ? options._redisStoreFactory({ client: client as any, prefix: redis?.keyPrefix || 'sess:', ttl: maxAgeInMinutes * 60 })
      : new RedisStore({
          client: client as any,
          prefix: redis?.keyPrefix || 'sess:',
          ttl: maxAgeInMinutes * 60,
          disableTouch: false
        })
    logger.info(`Session store: Redis (prefix: ${redis?.keyPrefix || 'sess:'}, ttl: ${maxAgeInMinutes * 60}s)`)
    return store
  }
  logger.info('Session store: Memory (useRedisStore false)')
  return new session.MemoryStore()
}
