import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
import { Claim } from 'claims/models/claim'
import { ClaimState } from 'claims/models/claimState'
import { FormValidator } from 'forms/validation/formValidator'
import { StatementOfTruth } from 'forms/models/statementOfTruth'
import { FeesClient } from 'fees/feesClient'
import { TotalAmount } from 'forms/models/totalAmount'
import { draftInterestAmount } from 'shared/interestUtils'
import { PartyType } from 'common/partyType'
import { AllClaimTasksCompletedGuard } from 'claim/guards/allClaimTasksCompletedGuard'
import { IndividualDetails } from 'forms/models/individualDetails'
import { SoleTraderDetails } from 'forms/models/soleTraderDetails'
import { CompanyDetails } from 'forms/models/companyDetails'
import { OrganisationDetails } from 'forms/models/organisationDetails'
import { DateOfBirth } from 'forms/models/dateOfBirth'
import { PartyDetails } from 'forms/models/partyDetails'
import { User } from 'idam/user'
import { SignatureType } from 'common/signatureType'
import { QualifiedStatementOfTruth } from 'forms/models/qualifiedStatementOfTruth'
import { DraftService } from 'services/draftService'
import { DraftClaim } from 'drafts/models/draftClaim'
import { Draft } from '@hmcts/draft-store-client'
import { FeatureToggles } from 'utils/featureToggles'
import { LaunchDarklyClient } from 'shared/clients/launchDarklyClient'
import { YesNoOption } from 'models/yesNoOption'
import { FeaturesBuilder } from 'claim/helpers/featuresBuilder'
import { ClaimStoreClient } from 'claims/claimStoreClient'
import { noRetryRequest } from 'client/request'
import { Logger } from '@hmcts/nodejs-logging'
import { MoneyConverter } from 'fees/moneyConverter'

const logger = Logger.getLogger('claims/claimStoreClient')
const featureToggles: FeatureToggles = new FeatureToggles(new LaunchDarklyClient())
const claimStoreClient: ClaimStoreClient = new ClaimStoreClient(noRetryRequest)
const launchDarklyClient: LaunchDarklyClient = new LaunchDarklyClient()
const featuresBuilder: FeaturesBuilder = new FeaturesBuilder(claimStoreClient, launchDarklyClient)

async function getClaimAmountTotal (draft: DraftClaim): Promise<TotalAmount> {
  const interest: number = await draftInterestAmount(draft)
  const totalAmount: number = draft.amount.totalAmount()

  return FeesClient.calculateIssueFee(totalAmount + interest)
    .then((feeAmount: number) => new TotalAmount(totalAmount, interest, feeAmount))
}

function getBusinessName (partyDetails: PartyDetails): string {
  if (partyDetails.type === PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value) {
    return (partyDetails as SoleTraderDetails).businessName
  } else {
    return undefined
  }
}

function getDateOfBirth (partyDetails: PartyDetails): DateOfBirth {
  if (partyDetails.type === PartyType.INDIVIDUAL.value) {
    return (partyDetails as IndividualDetails).dateOfBirth
  } else {
    return undefined
  }
}

function getContactPerson (partyDetails: PartyDetails): string {
  if (partyDetails.type === PartyType.COMPANY.value) {
    return (partyDetails as CompanyDetails).contactPerson
  } else if (partyDetails.type === PartyType.ORGANISATION.value) {
    return (partyDetails as OrganisationDetails).contactPerson
  } else {
    return undefined
  }
}

function deserializerFunction (value: any): StatementOfTruth | QualifiedStatementOfTruth {
  switch (value.type) {
    case SignatureType.BASIC:
      return StatementOfTruth.fromObject(value)
    case SignatureType.QUALIFIED:
      return QualifiedStatementOfTruth.fromObject(value)
    default:
      throw new Error(`Unknown statement of truth type: ${value.type}`)
  }
}

function getStatementOfTruthClassFor (draft: Draft<DraftClaim>): { new (): StatementOfTruth | QualifiedStatementOfTruth } {
  if (draft.document.claimant.partyDetails.isBusiness()) {
    return QualifiedStatementOfTruth
  } else {
    return StatementOfTruth
  }
}

function getClaimantPartyDetailsPageUri (partyDetails: PartyDetails): string {
  switch (partyDetails.type) {
    case PartyType.COMPANY.value:
      return Paths.claimantCompanyDetailsPage.uri
    case PartyType.ORGANISATION.value:
      return Paths.claimantOrganisationDetailsPage.uri
    case PartyType.INDIVIDUAL.value:
      return Paths.claimantIndividualDetailsPage.uri
    case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
      return Paths.claimantSoleTraderOrSelfEmployedDetailsPage.uri
    default:
      throw new Error(`Unknown party type: ${partyDetails.type}`)
  }
}

function getDefendantPartyDetailsPageUri (partyDetails: PartyDetails): string {
  switch (partyDetails.type) {
    case PartyType.COMPANY.value:
      return Paths.defendantCompanyDetailsPage.uri
    case PartyType.ORGANISATION.value:
      return Paths.defendantOrganisationDetailsPage.uri
    case PartyType.INDIVIDUAL.value:
      return Paths.defendantIndividualDetailsPage.uri
    case PartyType.SOLE_TRADER_OR_SELF_EMPLOYED.value:
      return Paths.defendantSoleTraderOrSelfEmployedDetailsPage.uri
    default:
      throw new Error(`Unknown party type: ${partyDetails.type}`)
  }
}

function renderView (form: Form<StatementOfTruth>, res: express.Response, next: express.NextFunction) {
  const draft: Draft<DraftClaim> = res.locals.claimDraft

  getClaimAmountTotal(draft.document)
    .then(async (interestTotal: TotalAmount) => {
      const helpWithFeesFeature: boolean = await featureToggles.isHelpWithFeesEnabled()
      if (helpWithFeesFeature
      && draft.document.helpWithFees && draft.document.helpWithFees.declared.option === YesNoOption.YES.option) {
        draft.document.feeAmountInPennies = MoneyConverter.convertPoundsToPennies(interestTotal.feeAmount)
      }
      res.render(Paths.checkAndSendPage.associatedView, {
        draftClaim: draft.document,
        claimAmountTotal: interestTotal,
        contactPerson: getContactPerson(draft.document.claimant.partyDetails),
        businessName: getBusinessName(draft.document.claimant.partyDetails),
        dateOfBirth: getDateOfBirth(draft.document.claimant.partyDetails),
        defendantBusinessName: getBusinessName(draft.document.defendant.partyDetails),
        partyAsCompanyOrOrganisation: draft.document.claimant.partyDetails.isBusiness(),
        claimantPartyDetailsPageUri: getClaimantPartyDetailsPageUri(draft.document.claimant.partyDetails),
        defendantPartyDetailsPageUri: getDefendantPartyDetailsPageUri(draft.document.defendant.partyDetails),
        paths: Paths,
        form,
        helpWithFeesFeature
      })
    }).catch(next)
}

async function handleHelpwWithFees (draft: Draft<DraftClaim>, user: User): Promise<boolean> {
  const features = await featuresBuilder.features(draft.document.amount.totalAmount(), user)

  // retrieve claim to check if the claimant initiated payment
  const existingClaim: void | Claim = await claimStoreClient.retrieveByExternalId(draft.document.externalId, user)
  .catch((e) => {
    logger.warn(`Unable to decide if payment has been initiated. ${e}`)
  })

  let helpWithFeesClaim: void | Claim
  // if payment was initiated then use 'updateHelpWithFeesClaim'(put request) else use 'saveHelpWithFeesClaim' (post request)
  if (existingClaim && ClaimState[existingClaim.state] === ClaimState.AWAITING_CITIZEN_PAYMENT) {
    helpWithFeesClaim = await claimStoreClient.updateHelpWithFeesClaim(draft, user, features)
    .catch((e) => {
      logger.warn(`Help With Fees Claim ${draft.document.externalId} update was unsuccessful. ${e}`)
    })
  } else {
    helpWithFeesClaim = await claimStoreClient.saveHelpWithFeesClaim(draft, user, features)
    .catch((e) => {
      logger.warn(`Help With Fees Claim ${draft.document.externalId} appears to have not been saved. ${e}`)
    })
  }
  // finally if helpwWithFeesClaim is successfully updated/saved then consider it as successful
  if (helpWithFeesClaim) {
    return true
  }
  // else unsuccessful
  return false
}
/* tslint:disable:no-default-export */
export default express.Router()
  .get(Paths.checkAndSendPage.uri, AllClaimTasksCompletedGuard.requestHandler, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const draft: Draft<DraftClaim> = res.locals.claimDraft
    const StatementOfTruthClass = getStatementOfTruthClassFor(draft)
    renderView(new Form(new StatementOfTruthClass()), res, next)
  })
  .post(Paths.checkAndSendPage.uri,
    AllClaimTasksCompletedGuard.requestHandler,
    FormValidator.requestHandler(undefined, deserializerFunction),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const form: Form<StatementOfTruth | QualifiedStatementOfTruth> = req.body

      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const draft: Draft<DraftClaim> = res.locals.claimDraft
        const user: User = res.locals.user
        if (form.model.type === SignatureType.QUALIFIED) {
          draft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await new DraftService().save(draft, user.bearerToken)
        }

        // help with fees
        if (await featureToggles.isHelpWithFeesEnabled()
          && draft.document.helpWithFees && draft.document.helpWithFees.declared.option === YesNoOption.YES.option) {

          // handle helpWithFees
          const helpWithFeesSuccessful = await handleHelpwWithFees(draft, user)

          // if successful delete draft else redirect to tasklist page
          if (helpWithFeesSuccessful) {
            await new DraftService().delete(draft.id, user.bearerToken)
            // redirect to confirmation page
            res.redirect(Paths.confirmationPage.evaluateUri({ externalId: draft.document.externalId }))
          } else {
            logger.warn(`Helpw With Fees Claim ${draft.document.externalId} update/save was unsuccessful so redirecting to tasklist page`)
            res.redirect(Paths.taskListPage.uri)
          }

        } else {
          if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
            res.redirect(Paths.initiatePaymentController.uri)
          } else {
            res.redirect(Paths.startPaymentReceiver.uri)
          }
        }
      }
    })
