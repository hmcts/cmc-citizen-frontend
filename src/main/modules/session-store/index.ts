import * as config from 'config'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import Redis from 'ioredis'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('session-store')

/** Fallback values when env vars (custom-environment-variables) are not set; match config/default.json except useRedisStore defaults true */
const SESSION_DEFAULTS = {
  cookieName: 'citizen-ui-session',
  secret: 'local-session-secret',
  useRedisStore: true,
  maxAgeInMinutes: 120,
  redis: {
    host: 'localhost',
    port: 6379,
    tls: false,
    keyPrefix: 'citizen-ui-session:'
  } as { host: string; port: number; tls: boolean; keyPrefix: string }
}

function getSessionConfig (): typeof SESSION_DEFAULTS & { redis: typeof SESSION_DEFAULTS.redis & { key?: string } } {
  const rawRedis = config.get<{ host?: string; port?: number; key?: string; tls?: boolean; keyPrefix?: string }>('session.redis') || {}
  return {
    cookieName: config.get<string>('session.cookieName') ?? SESSION_DEFAULTS.cookieName,
    secret: config.get<string>('session.secret') ?? SESSION_DEFAULTS.secret,
    useRedisStore: config.get<boolean>('session.useRedisStore') ?? SESSION_DEFAULTS.useRedisStore,
    maxAgeInMinutes: config.get<number>('session.maxAgeInMinutes') ?? SESSION_DEFAULTS.maxAgeInMinutes,
    redis: {
      host: rawRedis.host ?? SESSION_DEFAULTS.redis.host,
      port: rawRedis.port ?? SESSION_DEFAULTS.redis.port,
      key: rawRedis.key,
      tls: rawRedis.tls ?? SESSION_DEFAULTS.redis.tls,
      keyPrefix: rawRedis.keyPrefix ?? SESSION_DEFAULTS.redis.keyPrefix
    }
  }
}

const sessionConfig = getSessionConfig()
const useRedisStore = sessionConfig.useRedisStore
const redisConfig = sessionConfig.redis

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

function getRedisConnectionString (redis: SessionStoreOptions['redis'], authKey: string): string {
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

/** Returns a safe hint for logging: first 3 and last 3 characters of the token, or "***" if too short. */
function maskTokenHint (token: string): string {
  if (!token || token.length === 0) return '(empty)'
  if (token.length <= 6) return '***'
  return `${token.slice(0, 3)}...${token.slice(-3)}`
}

/** Returns the first 5 characters of the key for logging; "***" if empty or too short. */
function draftStoreAccessKeyFirst5 (token: string): string {
  if (!token || token.length === 0) return '(empty)'
  if (token.length < 5) return '***'
  return token.slice(0, 5)
}

export function getSessionStore (options?: SessionStoreOptions): session.Store {
  const useRedis = options?.useRedisStore ?? useRedisStore
  const redis = options?.redis ?? redisConfig
  const redisAuthKey = getRedisAuthKey(options)
  const maxAgeInMinutes = options?.maxAgeInMinutes ?? sessionConfig.maxAgeInMinutes

  if (useRedis) {
    const connectionString = getRedisConnectionString(redis, redisAuthKey)
    if (!connectionString) {
      logger.error('SESSION_USE_REDIS_STORE is true but Redis is not configured. Set SESSION_REDIS_HOST and SESSION_REDIS_PORT (and SESSION_REDIS_KEY from Key Vault), or set SESSION_USE_REDIS_STORE=false for in-memory store.')
      throw new Error('Redis connection (session.redis.host/port/key) is required when session.useRedisStore is true')
    }
    const useTls = connectionString.startsWith('rediss://') || redis?.tls === true
    const redisClientOptions = {
      maxRetriesPerRequest: 3,
      connectTimeout: 10000,
      enableReadyCheck: true,
      tls: useTls ? { rejectUnauthorized: true } : undefined
    }
    const client = options?._redisFactory
      ? options._redisFactory(connectionString, redisClientOptions)
      : new Redis(connectionString, redisClientOptions)
    client.on('error', (err: Error & { code?: string }) => {
      logger.error('[REDIS] Session store error', {
        error: err.message,
        errorName: err.name,
        errorCode: err.code,
        host: redis?.host,
        port: redis?.port,
        tls: useTls
      })
    })
    client.on('ready', () => {
      logger.info('[REDIS] Session store connected successfully', { host: redis?.host, port: redis?.port, tls: useTls, keyPrefix: redis?.keyPrefix || 'sess:', status: 'ready' })
    })
    const store = options?._redisStoreFactory
      ? options._redisStoreFactory({ client: client as any, prefix: redis?.keyPrefix || 'sess:', ttl: maxAgeInMinutes * 60 })
      : new RedisStore({
          client: client as any,
          prefix: redis?.keyPrefix || 'sess:',
          ttl: maxAgeInMinutes * 60
        })
    const keyFirst5 = draftStoreAccessKeyFirst5(redisAuthKey)
    logger.info('[REDIS] Session store initialised successfully', {
      host: redis?.host,
      port: redis?.port,
      tls: useTls,
      keyPrefix: redis?.keyPrefix || 'sess:',
      maxAgeInMinutes,
      cookieName: sessionConfig.cookieName,
      tokenHint: maskTokenHint(redisAuthKey),
      draftStoreAccessKeyFirst5: keyFirst5
    })
    logger.info('[REDIS] draft-store-access-key first 5 chars', { draftStoreAccessKeyFirst5: keyFirst5 })
    return store
  }
  logger.info('Session store: Memory (useRedisStore false)')
  return new session.MemoryStore()
}

/** Session config with fallbacks to default.json when env vars are unset. Use in app.ts for cookieName, secret, maxAgeInMinutes. */
export { getSessionConfig }
