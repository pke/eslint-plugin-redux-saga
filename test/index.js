"use strict"

var RuleTester = require("eslint").RuleTester
var parserOptions = require("./parserOptions")

RuleTester.setDefaultConfig({
  parserOptions: parserOptions
})
