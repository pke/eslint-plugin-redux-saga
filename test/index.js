"use strict"

var RuleTester = require("eslint/lib/testers/rule-tester")
var parserOptions = require("./parserOptions")

RuleTester.setDefaultConfig({
  parserOptions: parserOptions
})
