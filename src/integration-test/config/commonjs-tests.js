const fs = require('fs')
const path = require('path')

// CodeceptJS 4 imports test files through ESM. Bridge to the existing ts-node
// CommonJS suite so its path aliases and page-object imports keep working.
module.exports = function prepareTests () {
  const sourceRoot = path.resolve(__dirname, '../tests')
  const outputRoot = path.resolve(__dirname, '../../../build/codecept-tests')
  const tests = []

  function visit (directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const source = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        visit(source)
      } else if (/_test\.(ts|js)$/.test(entry.name)) {
        const target = path.join(outputRoot, path.relative(sourceRoot, source).replace(/\.(ts|js)$/, '.cjs'))
        fs.mkdirSync(path.dirname(target), { recursive: true })
        fs.writeFileSync(target, `module.exports = require(${JSON.stringify(source)})\n`)
        tests.push(target)
      }
    }
  }

  visit(sourceRoot)
  return tests
}
