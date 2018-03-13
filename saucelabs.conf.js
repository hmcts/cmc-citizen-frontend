const supportedBrowsers = require('@hmcts/cmc-supported-browsers').supportedBrowsers

const browser = requiredValue(process.env.SAUCELABS_BROWSER, 'SAUCELABS_BROWSER')
const saucelabsTunnelIdentifier = requiredValue(process.env.SAUCELABS_TUNNEL_IDENTIFIER, 'SAUCELABS_TUNNEL_IDENTIFIER')
const saucelabsUsername = requiredValue(process.env.SAUCELABS_USERNAME, 'SAUCELABS_USERNAME')
const saucelabsAccessKey = requiredValue(process.env.SAUCELABS_ACCESS_KEY, 'SAUCELABS_ACCESS_KEY')

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
      host: 'ondemand.saucelabs.com',
      port: 80,
      user: saucelabsUsername,
      key: saucelabsAccessKey,
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
