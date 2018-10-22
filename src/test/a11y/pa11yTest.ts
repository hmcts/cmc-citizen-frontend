/* tslint:disable:no-console */
import { Response, SuperTest, Test } from 'supertest'
import { EventEmitter } from 'events'
import * as config from 'config'
import * as pa11y from 'pa11y'

const cookieName: string = config.get<string>('session.cookieName')

export class Pa11yTestResults {
  public readonly issues: string[]

  private constructor (issues: string[]) {
    this.issues = issues
  }

  static okay (): Pa11yTestResults {
    return new Pa11yTestResults([])
  }

  static withIssue (issue: string): Pa11yTestResults {
    const issues: string[] = [issue]
    return new Pa11yTestResults(issues)
  }

  static withIssues (...issues: string[]): Pa11yTestResults {
    return new Pa11yTestResults(issues)
  }

  static expectedToBe (expected: string, actual: string): Pa11yTestResults {
    if (expected === actual) {
      return Pa11yTestResults.okay()
    }
    return Pa11yTestResults.withIssue(`expected "${expected}" but actually "${actual}"`)
  }

  static expectedNotToBe (unexpected: string, actual: string): Pa11yTestResults {
    if (unexpected === actual) {
      return Pa11yTestResults.withIssue(`expected not to be ${unexpected}`)
    }
    return Pa11yTestResults.okay()
  }
}

export class Pa11yTest {
  public readonly uri: string
  public headingResults: Pa11yTestResults = null
  public a11yResults: Pa11yTestResults = null

  private readonly emitter: EventEmitter
  private readonly agentSupplier: () => SuperTest<Test>
  private readonly trainMocks: () => void

  constructor (uri: string, emitter: EventEmitter, agentSupplier: () => SuperTest<Test>, trainMocks: () => void) {
    this.uri = uri
    this.emitter = emitter
    this.agentSupplier = agentSupplier
    this.trainMocks = trainMocks
  }

  static async runPa11y (url: string): Promise<Pa11yTestResults> {
    const result = await pa11y(url, {
      headers: {
        Cookie: `${cookieName}=ABC;state=000MC000`
      },
      chromeLaunchConfig: {
        args: ['--no-sandbox']
      }
    }).catch(errors => Pa11yTestResults.withIssues(errors))

    if (result.issues && result.issues.length > 0) {
      return Pa11yTestResults.withIssues(result.issues)
    }
    return Pa11yTestResults.okay()
  }

  headingResultsEventName (): string {
    return `heading results: ${this.uri}`
  }

  a11yResultsEventName () {
    return `a11y results: ${this.uri}`
  }

  async test () {
    const agent: SuperTest<Test> = this.agentSupplier()
    this.trainMocks()

    await this.ensureHeadingIsIncludedInPageTitle(this.uri, agent)
      .then(results => this.emitter.emit(this.headingResultsEventName(), results))

    await Pa11yTest.runPa11y(agent.get(this.uri).url)
      .then(results => this.emitter.emit(this.a11yResultsEventName(), results))
  }

  async ensureHeadingIsIncludedInPageTitle (url: string, agent: SuperTest<Test>): Promise<Pa11yTestResults> {
    let res: Response = null
    let requestError: any = null
    await agent.get(url).set('Cookie', `${cookieName}=ABC;state=000MC000`)
      .then(result => res = result)
      .catch(error => requestError = error)

    if (requestError != null) {
      return Pa11yTestResults.withIssue(JSON.stringify(requestError))
    }
    if (res.redirect) {
      return Pa11yTestResults.withIssue(`Call to ${url} resulted in a redirect to ${res.get('Location')}`)
    }
    if (!res.ok) {
      return Pa11yTestResults.withIssue(`Call to ${url} resulted in ${res.status}`)
    }

    const text = res.text
    const title: string = text.match(/<title>(.*)<\/title>/)[1]
    const heading: RegExpMatchArray = text.match(/<h1 class="heading-large">\s*(.*)\s*<\/h1>/)

    // Some pages do not have a heading section, e.g. confirmation pages
    if (heading) {
      return Pa11yTestResults.expectedToBe(`${heading[1]} - Money Claims`, title)
    } else {
      return Pa11yTestResults.expectedNotToBe(' - Money Claims', title)
    }
  }
}
