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
      code: buildTest("import { take as t } from 'redux-saga'", "yield t('ACTION')")
    },
    {
      // If it is an effect name but not imported from `redux-saga` then its valid
      code: buildTest(null, "take('ACTION')")
    },
    {
      code: buildTest("import { take } from 'redux-saga'", "notAnEffectDoesNotNeedYield()")
    },
    {
      code: "import createSagaMiddleware from 'redux-saga'; const sagaMiddleware = createSagaMiddleware();"
    },
    {
      code: buildTest("import { noop } from 'redux-saga'", "noop()")
    }
  ],
  invalid: [
    {
      code: buildTest("import { take } from 'redux-saga'", "take('ACTION')"),
      output: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')"),
      errors: [{message: "take effect must be yielded"}]
    },
    {
      code: buildTest("import { take as t } from 'redux-saga'", "t('ACTION')"),
      output: buildTest("import { take as t } from 'redux-saga'", "yield t('ACTION')"),
      errors: [{message: "t (take) effect must be yielded"}]
    }
  ]
})
