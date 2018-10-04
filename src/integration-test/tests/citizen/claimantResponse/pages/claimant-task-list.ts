import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  selectTaskViewDefendantResponse (): void {
    I.click('View the defendant’s full response')
  }

  selectTaskAcceptOrRejectPartAdmit (): void {
    I.click('Accept or reject')
  }

  selectTaskCheckandSubmitYourResponse (): void {
    I.click('Check and submit your response')
  }

}
