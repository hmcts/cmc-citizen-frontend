declare const Scenario: (string: string, { retries: number }, callback: ICodeceptCallback) => any;

declare namespace CodeceptJS {
  export interface I {
    createCitizenUser: () => Promise[string]
    createSolicitorUser: () => Promise[string]
    createClaim: (claimData: ClaimData, submitterEmail: string, linkDefendant?: boolean, features?: string[], role?: string) => Promise[string]
    waitForOpenClaim: (referenceNumber: string) => Promise[boolean]
    respondToClaim: (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string) => void
    retrievePin (letterHolderId: string): () => string
    amOnCitizenAppPage: (path: string) => void
    checkForIE11: () => any
    waitIfOnSafari: () => any
    fillField: (locator: string | object, value: string) => any
    selectOption: (select: string | object, option: string) => any
    rejectAnsweringPCQ: () => any
    bypassPCQ: () => Promise<any>
    checkPCQHealth: () => Promise<boolean>
    handelHelpWithFees: () => Promise<any>
    rejectHWF: () => any
    checkHWF: () => Promise<boolean>
  }
}

type CodeceptJSHelper = {
  _before: () => void;
  _after: () => void;
}

declare const codecept_helper: { new(): CodeceptJSHelper }
