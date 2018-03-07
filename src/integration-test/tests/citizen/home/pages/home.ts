import I = CodeceptJS.I

const I: I = actor()

export class HomePage {

  open (): void {
    I.amOnCitizenAppPage('/')
  }

}
