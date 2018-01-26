import { ResponseDraft } from 'response/draft/responseDraft'

export class WhenDidYouPayTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {
    return (responseDraft.whenDidYouPay.text && responseDraft.whenDidYouPay.date.year
      && responseDraft.whenDidYouPay.date.year.toString().length > 0)
  }
}
