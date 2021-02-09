import * as url from 'url'

export class ProxySettings {
  proxyType: string
  httpProxy: string
  sslProxy: string
  noProxy: string

  constructor () {
    if (process.env.http_proxy) {
      this.httpProxy = new url.URL(process.env.http_proxy).host
    }
    if (process.env.https_proxy) {
      this.sslProxy = new url.URL(process.env.http_proxy).host
    }
    if (process.env.no_proxy) {
      this.noProxy = process.env.no_proxy
    }

    if (this.httpProxy || this.sslProxy || this.noProxy) {
      this.proxyType = 'manual'
    } else {
      this.proxyType = 'direct'
    }
  }
}
