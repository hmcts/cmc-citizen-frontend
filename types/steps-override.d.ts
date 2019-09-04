declare const Scenario: (string: string, { retries: number }, callback: ICodeceptCallback) => void;

declare namespace CodeceptJS {
  export interface I {
    createCitizenUser: () => Promise[string]
    createSolicitorUser: () => Promise[string]
    createClaim: (claimData: ClaimData, submitterEmail: string) => Promise[string]
    createClaimWithFeatures: (claimData: ClaimData, submitterEmail: string, features: string[]) => Promise[string]
    createClaimWithFeaturesAndRole: (claimData: ClaimData, submitterEmail: string, role: string, features: string[]) => Promise[string]
    waitForOpenClaim: (referenceNumber: string) => Promise[boolean]
    linkDefendantToClaim: (claimRef: string, claimantEmail: string, defendantEmail: string) => void
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
