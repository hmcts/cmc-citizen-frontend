import { FeatureTestSuite } from './featureTestSuite'
import { CCJTestSuite } from './ccj'
import { EventEmitter } from 'events'
import { Pa11yPipeline } from './pa11yPipeline'
import { SuperTest, Test, agent } from 'supertest'
import { ClaimantResponseTestSuite } from './claimantResponse'
import { ClaimIssueTestSuite } from './claimIssue'
import { EligibilityTestSuite } from './eligibility'
import { FirstContactTestSuite } from './firstContact'
import { FullAdmissionTestSuite } from './fullAdmission'
import { OfferTestSuite } from './offer'
import { ResponseTestSuite } from './response'
import { StatementTestSuite } from './statement'
import * as os from 'os'
import * as express from 'express'
import './guardmocks'
import { createApp } from 'main/app'

const a11yFilter: string = (process.env.A11Y_FILTER || 'ALL').toUpperCase()
const parallel: boolean = (process.env.PARALLA11Y || 'FALSE') === 'TRUE'

const eventEmitter = new EventEmitter()
const pa11yPipeline: Pa11yPipeline = new Pa11yPipeline(eventEmitter, parallel ? os.cpus().length : 1)
const agentSupplier = () => makeAgent()

describe('Accessibility', async () => {

  const testSuites: FeatureTestSuite[] = [
    ifIncluded('ccj', () => new CCJTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('claimantResponse', () => new ClaimantResponseTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('claimIssue', () => new ClaimIssueTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('eligibility', () => new EligibilityTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('firstContact', () => new FirstContactTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('fullAdmission', () => new FullAdmissionTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('offer', () => new OfferTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('response', () => new ResponseTestSuite(pa11yPipeline, eventEmitter, agentSupplier)),
    ifIncluded('statement', () => new StatementTestSuite(pa11yPipeline, eventEmitter, agentSupplier))
  ].filter(suite => suite !== null)

  testSuites.forEach(suite => suite.enqueue())
  await pa11yPipeline.start()

})

function ifIncluded (feature: string, testSuiteSupplier: () => FeatureTestSuite): FeatureTestSuite {
  if (a11yFilter === 'ALL' || a11yFilter === feature.toUpperCase()) {
    return testSuiteSupplier()
  }
  return null
}

function makeAgent (): SuperTest<Test> {
  const app: express.Express = createApp()
  app.locals.csrf = 'dummy-token'
  return agent(app)
}
