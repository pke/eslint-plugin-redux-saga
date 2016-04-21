"use strict"
var rule = require("../best-before")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

ruleTester.run("best-before", rule, {
  valid: [
    "// BEST-BEFORE 2020-10-10"
  ],
  invalid: [
    {
      code: "// BEST-BEFORE 2016-03-07",
      errors: [{ message: "BEST-BEFORE expired since 2016-03-07" }]
    }
  ]
})

process.exit()