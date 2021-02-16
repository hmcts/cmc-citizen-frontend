export function convertToPoundsFilter (value: number): number {
  if (!value || (typeof value !== 'number')) {
    throw new Error('Value should be a number')
  }
  return value / 100
}
