import * as path from 'path'
import { Router } from 'express'
import * as requireDirectory from 'require-directory'
import * as uuid from 'uuid'

const fileExtension: string = path.extname(__filename).slice(1)

const options: object = {
  extensions: [fileExtension],
  recurse: true,
  rename: (name) => {
    return `${name}-${uuid()}`
  },
  visit: (obj: any) => {
    return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj
  }
}

export class RouterFinder {

  static findAll (path: string): Router[] {
    const routes: object = requireDirectory(module, path, options)

    const map = (value: object): Router[] => {
      return Object.values(value).reduce((routes: Router[], value: Router | object) => {
        const type: string = typeof value

        switch (type) {
          case 'function':
            routes.push(value as Router)
            break
          case 'object':
            routes.push(...map(value))
            break
        }
        return routes
      }, [])
    }

    return map(routes)
  }

}
