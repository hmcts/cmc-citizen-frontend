import { ResponseDraft } from 'response/draft/responseDraft'

export class HowMuchPaidTask {
  static isCompleted (responseDraft: ResponseDraft): boolean {

    console.log('responseDraft.howMuchIsPaid.amount',responseDraft.howMuchIsPaid.amount)
    console.log('responseDraft.howMuchIsPaid.tex', responseDraft.howMuchIsPaid.text)
    console.log('responseDraft.howMuchIsPaid.isCompleted()',responseDraft.howMuchIsPaid.isCompleted())

    return (responseDraft.howMuchIsPaid.amount && responseDraft.howMuchIsPaid.text && responseDraft.howMuchIsPaid.isCompleted())
  }
}
