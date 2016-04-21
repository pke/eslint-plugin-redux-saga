"use strict"
var rule = require("../../../lib/rules/yield-effects")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

ruleTester.run("yield-effects", rule, {
  valid: [
    {
      code: "function* test() { yield take('ACTION') }",
      parserOptions: { ecmaVersion: 6 }
    }, 
    {
      code: "function* test() { notAnEffectDoesNotNeedYield() }",
      parserOptions: { ecmaVersion: 6 } 
    }    
  ],
  invalid: [
    {
      code: "function* test() { take('ACTION') }",
      output: "function* test() { yield take('ACTION') }",
      parserOptions: { ecmaVersion: 6 },
      errors: [{ message: "take effect must be yielded" }]
    }
  ]
})

process.exit()