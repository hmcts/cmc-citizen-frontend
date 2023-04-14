import * as express from 'express'
import * as helmet from 'helmet'

const self = '\'self\''

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {
  }

  enableFor (app: express.Express) {
    const inlineJsEnabledBodyClassName = '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\''
    const inlineJsWindowGOVUKClassName = '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\''
    const additionalClassName = '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\''
    const scriptSrc = [
      inlineJsEnabledBodyClassName,
      additionalClassName,
      inlineJsWindowGOVUKClassName,
      self,
      '\'unsafe-inline\'',
      (_req, res) => `'nonce-${res.locals.nonce}'`,
      '*.google-analytics.com',
      'www.googletagmanager.com',
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'www.apply-for-probate.service.gov.uk',
      'https://webchat-client.ctsc.hmcts.net'
    ]
    const connectSrc = [self, '*.gov.uk', 'https://webchat-client.ctsc.hmcts.net', 'wss://webchat.ctsc.hmcts.net', 'https://webchat.ctsc.hmcts.net', '*.google-analytics.com', 'www.google-analytics.com', 'region1.google-analytics.com', 'region1.analytics.google.com']
    const scriptSrcElem = [self, '*.google-analytics.com', 'https://webchat-client.ctsc.hmcts.net', 'wss://webchat.ctsc.hmcts.net', 'https://webchat.ctsc.hmcts.net']

    if (this.developmentMode) {
      scriptSrc.push('https://localhost:35729')
      connectSrc.push('wss://localhost:35729')
    }

    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [
          '\'self\''
        ],
        fontSrc: [
          '\'self\' data:',
          'fonts.gstatic.com'
        ],
        scriptSrc: scriptSrc,
        scriptSrcElem: scriptSrcElem,
        connectSrc: connectSrc,
        mediaSrc: ['\'self\''],
        frameSrc: [
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com'
        ],
        imgSrc: [
          '\'self\'',
          '*.google-analytics.com',
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com',
          'ssl.gstatic.com',
          'www.gstatic.com',
          'stats.g.doubleclick.net',
          'https://webchat-client.ctsc.hmcts.net',
          'region1.google-analytics.com',
          'region1.analytics.google.com'
        ],
        styleSrc: [
          '\'self\'',
          '\'unsafe-inline\'',
          'https://webchat-client.ctsc.hmcts.net',
          'tagmanager.google.com',
          'fonts.googleapis.com'
        ],
        objectSrc: [self],
        frameAncestors: ['\'self\'']
      },
      reportOnly: false
    }))
  }
}
