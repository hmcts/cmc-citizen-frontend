require('ts-node/register')
require('tsconfig-paths/register')

const ProxySettings = require('./src/integration-test/config/proxy-settings').ProxySettings
const claimantEmail = `civilmoneyclaims+claimant-${require('randomstring').generate(7).toLowerCase()}@gmail.com`
const defendantEmail = `civilmoneyclaims+defendant-${require('randomstring').generate(7).toLowerCase()}@gmail.com`
const { bootstrapAll } = require('./src/integration-test/bootstrap/bootstrap')
const { teardownAll } = require('./src/integration-test/bootstrap/teardown')
const outputDir = './output'

exports.config = {
  name: 'citizen-integration-tests',
  async bootstrapAll() {
    await bootstrapAll(claimantEmail, defendantEmail)
  },
  async teardownAll() {
    await teardownAll(claimantEmail, defendantEmail)
  },
  tests: './src/integration-test/tests/**/*_test.*',
  output: `${process.cwd()}/${outputDir}`,
  timeout: 20000,
  multiple: {
    parallel: {
      chunks: parseInt(process.env.CHUNKS || '4')
    }
  },
  helpers: {
    WebDriver: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || 4444,
      browser: process.env.BROWSER || 'chrome',
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      waitForTimeout: 20000,
      restart: false,
      smartWait:5000,
      desiredCapabilities: {
        chromeOptions: {
          args: [ "--no-sandbox", "--disable-dev-shm-usage", "--allow-running-insecure-content", "--ignore-certificate-errors"]
        },
        proxy: new ProxySettings()
      }
    },
    IdamHelper: {
      require: './src/integration-test/helpers/idamHelper',
      claimantEmail,
      defendantEmail
    },
    ClaimStoreHelper: {
      require: './src/integration-test/helpers/claimStoreHelper',
      claimantEmail,
      defendantEmail
    },
    PageHelper: {
      require: './src/integration-test/helpers/pageHelper'
    },
    PcqHelper: {
      require: './src/integration-test/helpers/pcqHelper'
    },
    hwfHelper: {
      require: './src/integration-test/helpers/hwfHelper'
    },
    Mochawesome: {
      uniqueScreenshotNames: 'true'
    }
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: `${outputDir}/citizen-mocha-stdout.log`,
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || `${outputDir}/citizen-integration-result.xml`
        }
      },
      'mochawesome': {
        stdout: `${outputDir}/citizen-mochawesome-stdout.log`,
        options: {
          reportDir: outputDir,
          reportFilename: 'citizen-e2e-result',
          inlineAssets: true,
          reportTitle: `Citizen E2E tests result`
        }
      }
    }
  }
}
