const fs = require('fs')
const test = require('ava')
const jscodeshift = require('jscodeshift')
let transform = require('../index')

test('fixes sorting errors in non React components properly', t => {
  t.pass()

  const source = fs.readFileSync('./tests/sample.js', 'utf8')
  const output = fs.readFileSync('./tests/output.js', 'utf8')

  t.is(
    transform({ path: 'sample.js', source }, { jscodeshift }).trim(),
    output.trim()
  )
})
