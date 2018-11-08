export function convertToRawObject (object: object): object {
  return JSON.parse(JSON.stringify(object))
}
