require("ts-node/register");
require("tsconfig-paths/register");

const supportedBrowsers = require('./src/integration-test/crossbrowser/supportedBrowsers.js');
const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.BROWSER_GROUP || 'chrome';
const outputDir = './functional-output'
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['cmc']
};

function merge (intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options']
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
  name: 'integration-tests',
  bootstrap: './src/integration-test/bootstrap/bootstrap.ts',
  tests: './src/integration-test/tests/**/*_test.*',
  output: `${process.cwd()}/${outputDir}`,
  helpers: {
    WebDriver: {
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
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
    },
    Mochawesome: {
      uniqueScreenshotNames: 'true'
    }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true,
      delayAfter: 2000
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
        stdout: `${outputDir}/${browser}-citizen-mocha-junit-reporter-stdout.log`,
        options: {
          mochaFile: `${outputDir}/${browser}-citizen-e2e-result.xml`,
          reportTitle: `Citizen cross browser E2E results for: ${browser}`,
          inlineAssets: true
        }
      },
      mochawesome: {
        stdout: `${outputDir}/${browser}-citizen-mochawesome-stdout.log`,
        options: {
          reportDir: outputDir,
          reportFilename: `${browser}-citizen-e2e-result`,
          inlineAssets: true,
          reportTitle: `${browser} citizen E2E tests result`
        }
      }
    }
  },
  multiple: {
    microsoft: {
      browsers: getBrowserConfig('microsoft')
    },
    chrome: {
      browsers: getBrowserConfig('chrome')
    },
    firefox: {
      browsers: getBrowserConfig('firefox')
    },
    safari: {
      browsers: getBrowserConfig('safari')
    }
  }
};

exports.config = setupConfig;
