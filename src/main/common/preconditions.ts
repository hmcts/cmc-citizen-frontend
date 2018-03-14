export function checkDefined (value: any, errorMessage: string) {
  if (value == null) {
    throw new Error(errorMessage)
  }
}

export function checkNotEmpty (value: any[] | string, errorMessage: string) {
  checkDefined(value, errorMessage)

  if (value.length === 0) {
    throw new Error(errorMessage)
  }
}
