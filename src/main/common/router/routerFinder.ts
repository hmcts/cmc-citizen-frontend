import { Router } from 'express'
import * as requireDirectory from 'require-directory'

const options: object = {
  extensions: ['ts', 'js'],
  recurse: true,
  visit: (obj: any) => {
    return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj
  }
}

export class RouterFinder {

  static findAll (path: string): Router[] {
    return Object.values(requireDirectory(module, path, options))
  }

}
