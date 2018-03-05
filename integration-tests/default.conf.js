const ProxySettings = require('./src/config/proxy-settings').ProxySettings

exports.config = {
  name: 'integration-tests',
  bootstrap: './src/bootstrap/bootstrap.ts',
  tests: './src/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
  helpers: {
    WebDriverIO: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || '4444',
      browser: process.env.BROWSER || 'chrome',
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      waitForTimeout: 15000,
      desiredCapabilities: {
        proxy: new ProxySettings()
      }
    },
    IdamHelper: {
      require: './src/helpers/idamHelper'
    },
    ClaimStoreHelper: {
      require: './src/helpers/claimStoreHelper'
    },
    PageHelper: {
      require: './src/helpers/pageHelper'
    },
    DownloadPdfHelper: {
      require: './src/helpers/downloadPdfHelper'
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
        stdout: './output/mocha-stdout.log',
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './output/integration-result.xml'
        }
      },
      'mochawesome': {
        stdout: `./output/mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: `e2e-result`,
          inlineAssets: true,
          reportTitle: `E2E tests result`
        }
      }
    }
  }
}
