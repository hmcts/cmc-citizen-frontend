import * as express from 'express'
import * as config from 'config'
import * as toBoolean from 'to-boolean'

import { Paths } from 'claim/paths'
import { Form } from 'forms/form'
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
        if (form.model.type === SignatureType.QUALIFIED) {
          const user: User = res.locals.user
          draft.document.qualifiedStatementOfTruth = form.model as QualifiedStatementOfTruth
          await new DraftService().save(draft, user.bearerToken)
        }
        if (await featureToggles.isHelpWithFeesEnabled()
          && draft.document.helpWithFees && draft.document.helpWithFees.declared.option === YesNoOption.YES.option) {

          const draft: Draft<DraftClaim> = res.locals.claimDraft
          const user: User = res.locals.user
          const features = await featuresBuilder.features(draft.document.amount.totalAmount(), user)
          // save help with fees claim
          await claimStoreClient.saveHelpWithFeesClaim(draft, user, features)
          await new DraftService().delete(draft.id, user.bearerToken)
          // redirect to confirmation page
          res.redirect(Paths.confirmationPage.evaluateUri({ externalId: draft.document.externalId }))

        } else {
          if (toBoolean(config.get('featureToggles.inversionOfControl'))) {
            res.redirect(Paths.initiatePaymentController.uri)
          } else {
            res.redirect(Paths.startPaymentReceiver.uri)
          }
        }
      }
    })
