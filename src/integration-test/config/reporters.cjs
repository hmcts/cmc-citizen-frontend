const { reporters } = require('mocha')

// Keep console, XML and HTML output while accepting Mocha 12/CodeceptJS 4's
// ESM reporter exports. The legacy mocha-multi loader expects CJS constructors.
module.exports = class FunctionalReporters {
  constructor (runner, options) {
    this.reporters = Object.entries(options.reporterOptions).map(([name, config]) => {
      const loaded = reporters[name] || require(name)
      const Reporter = loaded.default || loaded
      // CodeceptJS gives each parallel worker its own mochaFile path.
      const reporterOptions = name === 'xunit'
        ? { ...config.options, output: config.options.mochaFile }
        : config.options
      return new Reporter(runner, { ...options, reporterOptions })
    })
  }

  done (failures, callback) {
    const pending = this.reporters.filter(reporter => typeof reporter.done === 'function')
    let remaining = pending.length
    if (!remaining) return callback(failures)
    for (const reporter of pending) {
      reporter.done(failures, () => {
        if (--remaining === 0) callback(failures)
      })
    }
  }
}
