import { YesNoOption } from 'models/yesNoOption'

export function yesNoFilter (value: YesNoOption | string): string {
  if (!value) {
    throw new Error('Input should be YesNoOption or string, cannot be empty')
  }

  if (typeof value === 'string') {
    return value === YesNoOption.YES.option ? 'Yes' : 'No'
  } else {
    return value.option === YesNoOption.YES.option ? 'Yes' : 'No'
  }
}
