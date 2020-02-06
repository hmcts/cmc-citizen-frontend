declare const Scenario: (string: string, { retries: number }, callback: ICodeceptCallback) => void;

declare namespace CodeceptJS {
  export interface I {
    createCitizenUser: () => Promise[string]
    createSolicitorUser: () => Promise[string]
    createClaim: (claimData: ClaimData, submitterEmail: string, linkDefendant?: boolean, features?: string[], role?: string) => Promise[string]
    waitForOpenClaim: (referenceNumber: string) => Promise[boolean]
    respondToClaim: (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string) => void
    retrievePin (letterHolderId: string): () => string
    amOnCitizenAppPage: (path: string) => void
    fillField: (locator: string, value: string) => any
    selectOption: (select: string, option: string) => any
  }
}

type CodeceptJSHelper = {
  _before: () => void;
  _after: () => void;
}

declare const codecept_helper: { new(): CodeceptJSHelper }
