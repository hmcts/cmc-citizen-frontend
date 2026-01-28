/**
 * Move root-level sessionCookie + beforeEach(getSessionCookie(app)) into the first describe.
 * Run from repo root: node scripts/move-session-hook-into-describe.js
 *
 * Fixes Jenkins failure where MediationDraft unit test was running a beforeEach from
 * another file (root-level hooks run on the global suite when all test files run together).
 */
const fs = require('fs')
const path = require('path')

const srcTest = path.join(__dirname, '..', 'src', 'test')

const ROOT_BLOCK_PATTERNS = [
  // "  beforeEach" (2 spaces)
  /\nlet sessionCookie: string\n  beforeEach\(async \(\) => \{\n    sessionCookie = await getSessionCookie\(app\)\n  \}\)\n\n/g,
  // "beforeEach" (no leading spaces)
  /\nlet sessionCookie: string\nbeforeEach\(async \(\) => \{\n  sessionCookie = await getSessionCookie\(app\)\n\}\)\n\n/g
]

const INNER_BLOCK = `  let sessionCookie: string
  beforeEach(async () => {
    sessionCookie = await getSessionCookie(app)
  })
`

function moveHookIntoFirstDescribe (content) {
  if (!content.includes('let sessionCookie: string') || !content.includes('sessionCookie = await getSessionCookie(app)')) {
    return { changed: false, content }
  }
  // Only process when session block is at root (before the first describe)
  const firstDescribe = content.indexOf('describe(')
  const firstSessionCookie = content.indexOf('let sessionCookie: string')
  if (firstSessionCookie > firstDescribe) {
    return { changed: false, content }
  }

  let newContent = content
  for (const re of ROOT_BLOCK_PATTERNS) {
    re.lastIndex = 0
    if (re.test(newContent)) {
      re.lastIndex = 0
      newContent = newContent.replace(re, '\n')
      break
    }
  }
  if (newContent === content) {
    return { changed: false, content }
  }

  // Find first describe('...', () => { and insert after the {
  const describeRe = /describe\s*\(\s*['`"](?:[^'`"]+)['`"]\s*,\s*\(\)\s*=>\s*\{\s*\n/
  const match = newContent.match(describeRe)
  if (!match) {
    return { changed: false, content }
  }
  const insertAt = newContent.indexOf(match[0]) + match[0].length
  newContent = newContent.slice(0, insertAt) + INNER_BLOCK + newContent.slice(insertAt)
  return { changed: true, content: newContent }
}

function processFile (filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const { changed, content: newContent } = moveHookIntoFirstDescribe(content)
  if (changed) {
    fs.writeFileSync(filePath, newContent)
    return true
  }
  return false
}

function walk (dir) {
  const files = fs.readdirSync(dir)
  let count = 0
  for (const f of files) {
    const full = path.join(dir, f)
    if (fs.statSync(full).isDirectory()) {
      count += walk(full)
    } else if (f.endsWith('.ts') && !f.endsWith('.d.ts')) {
      if (processFile(full)) {
        console.log('Updated:', full.replace(path.join(__dirname, '..'), ''))
        count++
      }
    }
  }
  return count
}

const n = walk(srcTest)
console.log('Done. Updated', n, 'files.')
