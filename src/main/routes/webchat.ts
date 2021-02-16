import * as express from 'express'
import * as config from 'config'

export class WebChat {
  static main: string = '/'

  static filterSecrets (accepted, secrets) {
    let result = {}
    for (let secret in secrets) {
      if (secret.search(accepted) > -1) {
        result[secret] = secrets[secret]
      }
    }
    return result
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
  .get(WebChat.main, (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const webChatSecrets = WebChat.filterSecrets(['cmc-webchat'], config.get('secrets.cmc'))
    res.send(JSON.stringify(webChatSecrets))
  })
