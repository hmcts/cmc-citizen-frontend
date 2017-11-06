export class RequireUtils {
  static removeModuleFromCache (module: string): void {
    const findModule = (key: string): boolean => key.includes(module)
    const moduleCacheKey = Object.keys(require.cache).find(findModule)
    delete require.cache[moduleCacheKey]
  }
}
