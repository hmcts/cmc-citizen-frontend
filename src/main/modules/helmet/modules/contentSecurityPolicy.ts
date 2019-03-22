import * as express from 'express'
import * as helmet from 'helmet'

const none = '\'none\''
const self = '\'self\''

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {}

  enableFor (app: express.Express) {
    const inlineJsEnabledBodyClassName = '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\''
    const inlineJsWindowGOVUKClassName = '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\''
    const scriptSrc = [inlineJsEnabledBodyClassName, inlineJsWindowGOVUKClassName, self, '*.google-analytics.com']
    const connectSrc = [self, '*.gov.uk']

    if (this.developmentMode) {
      scriptSrc.push('https://localhost:35729')
      connectSrc.push('wss://localhost:35729')
    }

    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [none],
        fontSrc: [self, 'data:'],
        imgSrc: [self, '*.google-analytics.com'],
        styleSrc: [self],
        scriptSrc: scriptSrc,
        connectSrc: connectSrc,
        objectSrc: [self],
        frameAncestors: [none]
      }
    }))
  }
}
