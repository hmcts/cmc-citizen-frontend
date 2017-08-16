export class ObjectUtils {

  static defaultWhenUndefined<T> (value: T, defaultValue: T): T {
    return value == null ? defaultValue : value
  }
}
