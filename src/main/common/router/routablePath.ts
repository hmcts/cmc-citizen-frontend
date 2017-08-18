export class RoutablePath {
  _uri: string

  constructor (uri: string, public feature: boolean = true) {
    if (!uri || uri.trim() === '') {
      throw new Error('URI is missing')
    }
    this._uri = uri
  }

  get uri (): string {
    return this._uri
      .replace(/\/index$/, '') // remove /index from uri's
  }

  get associatedView (): string {
    if (!this.feature) {
      return this._uri
        .replace(/\/:[^\/]+/g, '') // remove path params
        .substring(1) // remove leading slash
    }

    const split: string[] = this._uri
      .replace(/\/:[^\/]+/g, '') // remove path params
      .substring(1) // remove leading slash
      .split('/')

    const isCaseUri: boolean = split[0] === 'case'
    const featureName: string = isCaseUri ? split[1] : split[0]
    const viewPath: string = split.slice(isCaseUri ? 2 : 1).join('/')
    return `${featureName}/views/${viewPath}`
  }
}
