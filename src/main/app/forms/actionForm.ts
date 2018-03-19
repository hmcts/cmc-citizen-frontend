import { Form } from 'forms/form'

export class ActionForm<Model> extends Form<Model> {
  action: any
  postbackFocusTarget: string

  static buildPostbackFocusTarget (action: Object): string {
    if (typeof action !== 'object') {
      throw new Error('Action is expected to be an object instance')
    }
    const keys: string[] = Object.keys(action)
    if (keys.length > 1) {
      throw new Error('A single action was expected, but found multiple')
    }
    return `action[${keys.pop()}]`
  }
}
