import * as express from 'express'
import * as helmet from 'helmet'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

const none = '\'none\''
const self = '\'self\''

const webchatEnabled: boolean = toBoolean(config.get('featureToggles.webchat'))

export class ContentSecurityPolicy {

  constructor (public developmentMode: boolean) {}

  enableFor (app: express.Express) {

    const imgSrc = [self, '*.google-analytics.com'];
    const scriptSrc = [self, '*.google-analytics.com']
    const connectSrc = imgSrc
    const frameSrc = []

    if (this.developmentMode) {
      scriptSrc.push('http://localhost:35729')
      connectSrc.push('ws://localhost:35729')
    }

    if (webchatEnabled) {
      const webChatUrl: string = config.get('webchat.url');
      scriptSrc.push(webChatUrl)
      frameSrc.push(webChatUrl)
      imgSrc.push(webChatUrl)
    }



    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [none],
        fontSrc: [self, 'data:'],
        imgSrc: imgSrc,
        styleSrc: [self],
        scriptSrc: scriptSrc,
        connectSrc: connectSrc,
        objectSrc: [self],
        frameSrc: frameSrc
      }
    }))
  }
}
