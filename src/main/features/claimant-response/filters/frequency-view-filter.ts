import { Frequency } from 'common/frequency/frequency'

export namespace FrequencyViewFilter {
  export function render (value: string): string {
    return Frequency.of(value).displayValue
  }
}
