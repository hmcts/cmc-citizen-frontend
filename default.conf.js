const { server } = require('sinon')

require('ts-node/register')
require('tsconfig-paths/register')

const ProxySettings = require('./src/integration-test/config/proxy-settings').ProxySettings
const bootstrapFn = require('./src/integration-test/bootstrap/bootstrap').bootstrapAll
const tearDownFn = require('./src/integration-test/bootstrap/teardown').teardownAll
const UserEmails = require('./src/integration-test/data/test-data').UserEmails
const DEFAULT_PASSWORD = require('./src/integration-test/data/test-data').DEFAULT_PASSWORD

const userEmails = new UserEmails()

exports.config = {
  name: 'citizen-integration-tests',
  bootstrapAll: bootstrapFn,
  teardownAll: tearDownFn,
  tests: './src/integration-test/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
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
      waitForTimeout: 15000,
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
    }
  },
  plugins: {
    autoLogin: {
      enabled: true,
      users: {
        claimant: {
          login: async (I) => {
            await I.amOnCitizenAppPage('/');
            I.fillField('#username', userEmails.getClaimant());
            I.fillField('#password', DEFAULT_PASSWORD);
            I.click('input[type=submit]');
          },
          check: async (I) => {
            await I.amOnCitizenAppPage('/');
            await I.waitForText('My account');
          },
          fetch: () => {},
          restore: () => {},
        },
        defendant: {
          login: async (I) => {
            await I.amOnCitizenAppPage('/');
            I.fillField('#username', userEmails.getDefendant());
            I.fillField('#password', DEFAULT_PASSWORD);
            I.click('input[type=submit]');
          },
          check: async (I) => {
            await I.amOnCitizenAppPage('/');
            await I.waitForText('My account');
          },
          fetch: () => {},
          restore: () => {},
        }
      }
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
        stdout: './output/citizen-mocha-stdout.log',
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './output/citizen-integration-result.xml'
        }
      },
      'mochawesome': {
        stdout: `./output/citizen-mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: 'citizen-e2e-result',
          inlineAssets: true,
          reportTitle: `Citizen E2E tests result`
        }
      }
    }
  }
}
