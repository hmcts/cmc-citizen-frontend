require('ts-node/register')
require('tsconfig-paths/register')

const ProxySettings = require('./src/integration-test/config/proxy-settings').ProxySettings
const bootstrapFn = require('./src/integration-test/bootstrap/bootstrap').bootstrapAll
const tearDownFn = require('./src/integration-test/bootstrap/teardown').teardownAll
const outputDir = './output'

exports.config = {
  name: 'citizen-integration-tests',
  bootstrapAll: bootstrapFn,
  teardownAll: tearDownFn,
  tests: './src/integration-test/tests/**/*_test.*',
  output: `${process.cwd()}/${outputDir}`,
  timeout: 20000,
  multiple: {
    parallel: {
      chunks: parseInt(process.env.CHUNKS || '3')
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
      desiredCapabilities: {
        proxy: new ProxySettings()
      }
    },
    IdamHelper: {
      require: './src/integration-test/helpers/idamHelper'
    },
    ClaimStoreHelper: {
      require: './src/integration-test/helpers/claimStoreHelper'
    },
    PageHelper: {
      require: './src/integration-test/helpers/pageHelper'
    },
    PcqHelper: {
      require: './src/integration-test/helpers/pcqHelper'
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
