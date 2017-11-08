import * as path from 'path'
import { Router } from 'express'
import * as requireDirectory from 'require-directory'

const fileExtension: string = path.extname(__filename).slice(1)

const options: object = {
  extensions: [fileExtension],
  recurse: true,
  visit: (obj: any) => {
    return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj
  }
}

export class RouterFinder {

  static findAll (path: string): Router[] {
    const allRoutes = requireDirectory(module, path, options)

    const mappedRoutes: object = Object.keys(allRoutes).map(directory => {
      const routesInFileOrADirectory = allRoutes[directory]
      if (typeof routesInFileOrADirectory === 'object') {
        return Object.keys(routesInFileOrADirectory).map(route => routesInFileOrADirectory[route])
      }
      return routesInFileOrADirectory
    })

    return Object.values(mappedRoutes)
  }

}
