/* tslint:disable:no-unused-expression */
import { Pa11yTest } from './pa11yTest'
import { EventEmitter } from 'events'
import { expect } from 'chai'

export class Pa11yPipeline {
  private pa11yTests: Pa11yTest[] = []
  private readonly eventEmitter: EventEmitter
  private readonly parallelism: number

  constructor (eventEmitter: EventEmitter, parallelism: number = 1) {
    this.eventEmitter = eventEmitter
    this.parallelism = parallelism
  }

  add (test: Pa11yTest) {
    this.pa11yTests.push(test)
  }

  async start () {
    this.registerTestsWithMocha()
    await this.executeTests()
  }

  private registerTestsWithMocha () {
    this.pa11yTests.forEach(pa11yTest => {
      context(pa11yTest.uri, () => {
        this.eventEmitter.on(pa11yTest.headingResultsEventName(), results => pa11yTest.headingResults = results)
        this.eventEmitter.on(pa11yTest.a11yResultsEventName(), results => pa11yTest.a11yResults = results)

        it('should have the correct heading', async () => {
          while (!pa11yTest.headingResults) {
            await sleep(100)
          }
          // verify
          console.log(JSON.stringify(pa11yTest.headingResults.issues))
          expect(pa11yTest.headingResults.issues, JSON.stringify(pa11yTest.headingResults.issues)).to.be.empty
        })

        it('should have no a11y errors', async () => {
          while (!pa11yTest.a11yResults) {
            await sleep(100)
          }
          // verify
          expect(pa11yTest.a11yResults.issues, JSON.stringify(pa11yTest.a11yResults.issues)).to.be.empty
        })
      })
    })
  }

  private async executeTests () {
    const testQueue: Pa11yTest[] = [ ...this.pa11yTests ]
    const testsRunning: Pa11yTest[] = []
    while (testQueue.length > 0) {

      while (testsRunning.length >= this.parallelism) {
        await sleep(100)
      }
      const test: Pa11yTest = testQueue.shift()
      testsRunning.push(test)
      test.test().then(() => testsRunning.splice(testsRunning.indexOf(test), 1))
    }
  }
}

function sleep (ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
