import { Form } from 'forms/form'

export class ActionForm<Model> extends Form<Model> {
  action: any
  postbackFocusTarget: string
}
