import * as config from 'config'
import * as crypto from 'crypto'
import { Logger } from '@hmcts/nodejs-logging'
import { BaseParameters } from './models/pcqParameters'

const algorithm = 'aes-256-cbc'
const logger = Logger.getLogger('pcq/tokenGenerator')

export class TokenGenerator {

  static gen (params: BaseParameters): string {
    const tokenKey = config.get<string>('secrets.cmc.pcq-token-key')
    const iv = Buffer.alloc(16, 0) // Initialization vector.
    let encrypted
    if (tokenKey) {
      const key = crypto.scryptSync(tokenKey, 'salt', 32)
      Object.keys(params).forEach(p => {
        params[p] = String(params[p])
      })
      const strParams = JSON.stringify(params)
      const cipher = crypto.createCipheriv(algorithm, key, iv)
      encrypted = cipher.update(strParams, 'utf8', 'hex')
      encrypted += cipher.final('hex')
    } else {
      logger.error('PCQ token key is missing.')
    }
    return encrypted
  }
}
