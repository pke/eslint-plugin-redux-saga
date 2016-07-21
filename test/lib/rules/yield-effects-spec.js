"use strict"
var rule = require("../../../lib/rules/yield-effects")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

function buildTest(imports, code) {
  var result = (imports && (imports + ";")) || ""
  result += "function* test() { " + code + " }"
  return result
}

ruleTester.run("yield-effects", rule, {
  valid: [
    {
      code: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')")
    },
    {
      // If it is an effect name but not imported from `redux-saga` then its valid
      code: buildTest(null, "take('ACTION')")
    },
    {
      code: buildTest("import { take } from 'redux-saga'", "{ notAnEffectDoesNotNeedYield() }")
    }
  ],
  invalid: [
    {
      code: buildTest("import { take } from 'redux-saga'", "take('ACTION')"),
      output: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')"),
      errors: [{message: "take effect must be yielded"}]
    }
  ]
})
