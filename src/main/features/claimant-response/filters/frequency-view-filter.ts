import { Frequency } from 'common/frequency/frequency'

export namespace FrequencyViewFilter {
  export function render (frequency: Frequency): string {
    return frequency.displayValue
  }
}
