"use strict"
var rule = require("../../../lib/rules/yield-effects")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

function buildTest(imports, code) {
  var result = (imports && (imports + ";")) || ""
  result += "function* test() { " + code + " }"
  return result
}

var ERRORS = {
  overrides: "take overrides redux-saga effect with the same name",
  noyield: "take effect must be yielded"
}

ruleTester.run("yield-effects", rule, {
  valid: [
    {
      code: "import { take } from 'redux-saga';"
          + "const sagaTake = take;"
          + "export default function* saga() {"
          + "  yield sagaTake();"
          + "}"
    },
    {
      code: "import { take } from 'redux-saga';"
          + "export default function* saga() {"
          + "  const sagaTake = take;"
          + "  yield sagaTake();"
          + "}"
    },
    {
      code: "import { take as sagaTake } from 'redux-saga';"
          + "const sagaTakeCreator = sagaTake;"
          + "export default function* saga() {"
          + "  yield sagaTakeCreator();"
          + "}"
    },
    {
      code: "import { take as sagaTake } from 'redux-saga';"
          + "export default function* saga() {"
          + "  const sagaTakeCreator = sagaTake;"
          + "  yield sagaTakeCreator();"
          + "}"
    },
    {
      code: buildTest("import { take } from 'redux-saga'", "yield notAnEffect()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'", "const take = () => {}; yield sagaTake()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'", "function take() {} yield sagaTake()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'", "var take = function() {}; yield sagaTake()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'; const take = () => {};", "yield sagaTake()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'; function take() {}", "yield sagaTake()")
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'; var take = function() {};", "yield sagaTake()")
    },
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
      code: "import { take } from 'redux-saga';"
          + "export default function* saga() {"
          + "  const sagaTakeEffect = take();"
          + "  yield sagaTakeEffect;"
          + "}",
      errors: [ERRORS.noyield]
    },
    {
      code: "import { take as sagaTake } from 'redux-saga';"
          + "export default function* saga() {"
          + "  const sagaTakeEffect = sagaTake();"
          + "  yield sagaTakeEffect;"
          + "}",
      errors: ["sagaTake effect must be yielded"]
    },
    // overrides
    {
      code: buildTest("import { take } from 'redux-saga'", "const take = () => {}; yield take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; const take = () => {}", "yield take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; var take = function() {}", "yield take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; const take = function() {}", "yield take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; function take() {}", "yield take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'", "const take = () => {}; take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; const take = () => {}", "take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; var take = function() {}", "take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; const take = function() {}", "take()"),
      errors: [ERRORS.overrides]
    },
    {
      code: buildTest("import { take } from 'redux-saga'; function take() {}", "take()"),
      errors: [ERRORS.overrides]
    },

    // no yield
    {
      code: buildTest("import { take } from 'redux-saga'", "take('ACTION')"),
      output: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')"),
      errors: [ERRORS.noyield]
    },
    {
      code: buildTest("import { take as sagaTake } from 'redux-saga'", "sagaTake('ACTION')"),
      output: buildTest("import { take as sagaTake } from 'redux-saga'", "yield sagaTake('ACTION')"),
      errors: ["sagaTake effect must be yielded"]
    }
  ]
})
