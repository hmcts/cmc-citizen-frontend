import * as express from 'express'
import { expressCspHeader, INLINE, SELF, NONCE } from 'express-csp-header'

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {
  }

  enableFor (app: express.Express) {
    const inlineJsEnabledBodyClassName = '\'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU=\''
    const inlineJsWindowGOVUKClassName = '\'sha256-G29/qSW/JHHANtFhlrZVDZW1HOkCDRc78ggbqwwIJ2g=\''
    const additionalClassName = '\'sha256-AaA9Rn5LTFZ5vKyp3xOfFcP4YbyOjvWn2up8IKHVAKk=\''
    const localHttp = '\'https://localhost:35729\''
    const localWss = '\'wss://localhost:35729\''
    const scriptSrc = [
      inlineJsEnabledBodyClassName,
      inlineJsWindowGOVUKClassName,
      additionalClassName,
      SELF,
      INLINE,
      NONCE,
      '*.google-analytics.com',
      '*.googletagmanager.com',
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'www.apply-for-probate.service.gov.uk'
    ]
    const scriptSrcElem = [
      SELF,
      INLINE,
      '*.google-analytics.com',
      '*.googletagmanager.com'
    ]
    const connectSrc = [
      SELF,
      INLINE,
      '*.gov.uk',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]
    const imgSrc = [
      SELF,
      INLINE,
      '*.google-analytics.com',
      '*.analytics.google.com',
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'ssl.gstatic.com',
      'www.gstatic.com',
      'stats.g.doubleclick.net'
    ]
    const styleSrc = [
      SELF,
      INLINE,
      'tagmanager.google.com',
      'fonts.googleapis.com',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]
    const mediaSrc = [
      SELF,
      INLINE,
      'vcc-eu4.8x8.com',
      'vcc-eu4b.8x8.com',
      'ssl.gstatic.com',
      'www.gstatic.com',
      'stats.g.doubleclick.net',
      '*.google-analytics.com',
      '*.analytics.google.com'
    ]

    if (this.developmentMode) {
      scriptSrc.push(localHttp)
      connectSrc.push(localWss)
      scriptSrcElem.push(localHttp)
    }

    app.use(expressCspHeader({
      directives: {
        'default-src': [
          SELF,
          INLINE
        ],
        'script-src': scriptSrc,
        'script-src-elem': scriptSrcElem,
        'img-src': imgSrc,
        'style-src': styleSrc,
        'connect-src': connectSrc,
        'font-src': [
          '\'self\' data:',
          'fonts.gstatic.com',
          INLINE
        ],
        'media-src': mediaSrc,
        'frame-src': [
          INLINE,
          'vcc-eu4.8x8.com',
          'vcc-eu4b.8x8.com'
        ],
        'object-src': [
          SELF,
          INLINE
        ],
        'frame-ancestors': [
          SELF
        ]
      },
      reportOnly: false
    }))
  }
}
