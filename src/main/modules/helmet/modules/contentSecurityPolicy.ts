import * as express from 'express'
import * as helmet from 'helmet'

const self = '\'self\''
const inline = '\'unsafe-inline\''

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {
  }

  enableFor (app: express.Express) {
    const inlineJsEnabledBodyClassName = '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\''
    const inlineJsWindowGOVUKClassName = '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\''
    const additionalClassName = '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\''

    const scriptSrc = [
      inlineJsEnabledBodyClassName,
      inlineJsWindowGOVUKClassName,
      additionalClassName,
      self,
      inline,
      (_req, res) => `'nonce-${res.locals.nonce}'`,
      '*.google-analytics.com',
      '*.googletagmanager.com',
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'www.apply-for-probate.service.gov.uk'
    ]

    const connectSrc = [
      self,
      inline,
      '*.gov.uk',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]

    const scriptSrcElem = [
      self,
      inline,
      '*.google-analytics.com',
      '*.googletagmanager.com'
    ]

    const imgSrc = [
      self,
      inline,
      '*.google-analytics.com',
      '*.analytics.google.com',
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'ssl.gstatic.com',
      'www.gstatic.com',
      'stats.g.doubleclick.net'
    ]

    const styleSrc = [
      self,
      inline,
      'tagmanager.google.com',
      'fonts.googleapis.com',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]

    const mediaSrc = [
      self,
      inline,
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'ssl.gstatic.com',
      'www.gstatic.com',
      'stats.g.doubleclick.net',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]

    if (this.developmentMode) {
      scriptSrc.push('https://localhost:35729')
      connectSrc.push('wss://localhost:35729')
      scriptSrcElem.push('https://localhost:35729')
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
        mediaSrc: mediaSrc,
        frameSrc: [
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com'
        ],
        imgSrc: imgSrc,
        styleSrc: styleSrc,
        objectSrc: [self],
        frameAncestors: ['\'self\'']
      },
      reportOnly: false
    }))
  }
}
