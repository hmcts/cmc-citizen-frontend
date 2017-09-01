const pathParameterRegex = /\/:[^\/]+/g

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
        .replace(pathParameterRegex, '') // remove path params
        .substring(1) // remove leading slash
    }

    const split: string[] = this._uri
      .replace(pathParameterRegex, '') // remove path params
      .substring(1) // remove leading slash
      .split('/')

    const isCaseUri: boolean = split[0] === 'case'
    const featureName: string = isCaseUri ? split[1] : split[0]
    const viewPath: string = split.slice(isCaseUri ? 2 : 1).join('/')
    return `${featureName}/views/${viewPath}`
  }

  evaluateUri (substitutions: {[key: string]: string}): string {
    if (substitutions === undefined || Object.keys(substitutions).length === 0) {
      throw new Error('Path parameter substitutions are required')
    }

    const path = Object.entries(substitutions).reduce((uri: string, substitution: [string, string]) => {
      const [parameterName, parameterValue] = substitution
      return uri.replace(`:${parameterName}`, parameterValue)
    }, this.uri)

    if (pathParameterRegex.test(path)) {
      throw new Error('At least one path parameter substitution is missing')
    }

    return path
  }
}
