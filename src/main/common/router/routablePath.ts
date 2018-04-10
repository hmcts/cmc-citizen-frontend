import { StringUtils } from 'utils/stringUtils'

const pathParameterRegex = /\/:[^\/]+/g

/**
 *  Validates the path parameter value used in URI paths.
 *  And empty, null, undefined, string literal 'null' and 'undefined' are invalid values.
 *  This prevents undefined being passed to urls like: `/case/undefined/claim/receipt`
 */
function isValidParameterValue (parameterValue: string): boolean {
  return !(StringUtils.isBlank(parameterValue) || parameterValue === 'undefined' || parameterValue === 'null')
}

export class RoutablePath {
  private _uri: string

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

  evaluateUri (substitutions: { [key: string]: string }): string {
    if (substitutions === undefined || Object.keys(substitutions).length === 0) {
      throw new Error('Path parameter substitutions are required')
    }

    const path = Object.entries(substitutions).reduce((uri: string, substitution: [string, string]) => {
      const [parameterName, parameterValue] = substitution

      if (!isValidParameterValue(parameterValue)) {
        throw new Error(`Path parameter :${parameterName} is invalid`)
      }

      const updatedUri: string = uri.replace(`:${parameterName}`, parameterValue)
      if (updatedUri === uri) {
        throw new Error(`Path parameter :${parameterName} is not defined`)
      }
      return updatedUri
    }, this.uri)

    const missingParameters = path.match(pathParameterRegex)
    if (missingParameters) {
      const removeLeadingSlash = value => value.substring(1)
      throw new Error(`Path parameter substitutions for ${missingParameters.map(removeLeadingSlash).join(', ')} are missing`)
    }

    return path
  }
}
