"use strict"
var rule = require("../../../lib/rules/no-yield-in-race")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

ruleTester.run("no-yield-in-race", rule, {
  valid: [
    {
      code: "function* test() { yield race({ posts: call(fetchApis) }) }"
    },
    {
      code: "function* test() { yield race({ watchers: [call(watcher1), call(watcher2)] }) }"
    },
    {
      code: "function* test() { yield race([ call(watcher1), call(watcher2) ]) }"
    }
  ],
  invalid: [
    {
      code: "function* test() { yield race({ posts: yield call(fetchApis) }) }",
      output: "function* test() { yield race({ posts: call(fetchApis) }) }",
      errors: [{message: "yield not allowed inside race: posts"}]
    },
    {
      code: "function* test() { yield race({ watchers: yield [call(watcher1), call(watcher2)] }) }",
      errors: [{message: "yield not allowed inside race: watchers"}],
      output: "function* test() { yield race({ watchers: [call(watcher1), call(watcher2)] }) }"
    },
    {
      code: "function* test() { yield race([yield call(watcher1), call(watcher2)]) }",
      errors: [{message: "yield not allowed inside race array at index: 0"}],
      output: "function* test() { yield race([call(watcher1), call(watcher2)]) }"
    }
  ]
})

