import { readFile } from 'fs'
import * as converter from 'i18next-conv'

/**
 * A gettext backend for i18next framework
 */
export class Backend {
  static readonly type = 'backend'

  services: any
  options: any
  coreOptions: any

  constructor (services, options = {}) {
    this.init(services, options)
  }

  static defaultsOptions () {
    return {
      loadPath: '/locales/{{lng}}/{{ns}}.po'
    }
  }

  /**
   * Initializes backend (required by framework)
   * @param services - available services
   * @param options - backend options
   * @param coreOptions - i18next options
   */
  init (services, options = {}, coreOptions = {}) {
    this.services = services
    this.options = Object.assign({}, Backend.defaultsOptions(), options)
    this.coreOptions = coreOptions
  }

  /**
   * Reads translations from PO file (required by framework)
   * @param language - language to be loaded
   * @param namespace - namespace to be used
   * @param callback - standard Node.js callback function (err, data)
   */
  read (language, namespace, callback) {
    const translationFile = this.options.loadPath.replace(/{{lng}}/, language).replace(/{{ns}}/, namespace)

    readFile(translationFile, (err, data) => {
      if (err) return callback(err, null)

      converter
        .gettextToI18next(language, data)
        .then(translation => callback(null, JSON.parse(translation)))
        .catch(error => callback(error, null))
    })
  }
}
