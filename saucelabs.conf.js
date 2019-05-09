require("ts-node/register");
require("tsconfig-paths/register");

const supportedBrowsers = require('@hmcts/cmc-supported-browsers').supportedBrowsers

const browser = requiredValue(process.env.SAUCE_BROWSER, 'SAUCELABS_BROWSER')
const saucelabsTunnelIdentifier = requiredValue(process.env.SAUCE_TUNNEL_IDENTIFIER, 'SAUCELABS_TUNNEL_IDENTIFIER')
const saucelabsUsername = requiredValue(process.env.SAUCE_USERNAME, 'SAUCELABS_USERNAME')
const saucelabsAccessKey = requiredValue(process.env.SAUCE_ACCESS_KEY, 'SAUCELABS_ACCESS_KEY')
console.log('-----------------Browser: - '+browser+'-----------------process.env.SAUCELABS_BROWSER: - '+process.env.SAUCELABS_BROWSER)
console.log('-----------------saucelabsTunnelIdentifier: - '+saucelabsTunnelIdentifier+'-----------------process.env.SAUCELABS_TUNNEL_IDENTIFIER: - '+process.env.SAUCELABS_TUNNEL_IDENTIFIER)
console.log('-----------------saucelabsUsername: - '+saucelabsUsername+'-----------------process.env.SAUCELABS_USERNAME: - '+process.env.SAUCE_USERNAME)
console.log('-----------------saucelabsAccessKey: - '+saucelabsAccessKey+'-----------------process.env.SAUCELABS_ACCESS_KEY: - '+process.env.SAUCE_ACCESS_KEY)

function requiredValue (envVariableValue, variableName) {
  if (envVariableValue && envVariableValue.trim().length > 0) {
    return envVariableValue.trim()
  } else {
    throw new Error(`${variableName} is a required environment variable, but wasn't set`)
  }
}

function setupDesiredCapabilitiesFor (browser, saucelabsTunnelName) {
  let desiredCapability = supportedBrowsers[browser]
  desiredCapability.tunnelIdentifier = saucelabsTunnelName
  desiredCapability.tags = ['cmc']
  return desiredCapability
}

exports.config = {
  name: 'integration-tests',
  bootstrap: './src/integration-test/bootstrap/bootstrap.ts',
  tests: './src/integration-test/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
  helpers: {
    WebDriverIO: {
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      browser: supportedBrowsers[browser].browserName,
      waitForTimeout: 60000,
      windowSize: '1600x900',
      uniqueScreenshotNames: true,
      timeouts: {
        script: 60000,
        pageLoad: 60000,
        'page load': 60000
      },
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      desiredCapabilities: setupDesiredCapabilitiesFor(browser, saucelabsTunnelIdentifier)
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
    SaucelabsReporter: {
      require: './src/integration-test/helpers/saucelabsReporter'
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
        stdout: `./output/${browser}-citizen-mocha-junit-reporter-stdout.log`,
        options: {
          mochaFile: `./output/${browser}-citizen-e2e-result.xml`,
          reportTitle: `Citizen cross browser E2E results for: ${browser}`,
          inlineAssets: true
        }
      },
      'mochawesome': {
        stdout: `./output/${browser}-citizen-mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: `${browser}-citizen-e2e-result`,
          inlineAssets: true,
          reportTitle: `${browser} citizen E2E tests result`
        }
      }
    }
  }
}
