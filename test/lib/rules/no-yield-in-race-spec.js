"use strict"
var rule = require("../../../lib/rules/no-yield-in-race")
var RuleTester = require("eslint").RuleTester

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
    },
    {
      code: "function* foo() { const actions = ['LOGIN', 'LOGOUT']; yield race(actions.map(take)) }"
    }
  ],
  invalid: [
    {
      code: "function* test() { yield race({}, {}) }",
      errors: [{message: "race must have on object hash or array as the only argument"}]
    },
    {
      code: "function* test() { yield race(call(fetch1), call(fetch2)) }",
      errors: [{message: "race must have on object hash or array as the only argument"}]
    },
    {
      code: "function* test() { yield race({ posts: yield call(fetchApis) }) }",
      output: "function* test() { yield race({ posts: call(fetchApis) }) }",
      errors: [{message: "yield not allowed inside race: posts"}]
    },
    {
      code: "function* test() { yield race({ watchers: yield [call(watcher1), call(watcher2)] }) }",
      output: "function* test() { yield race({ watchers: [call(watcher1), call(watcher2)] }) }",
      errors: [{message: "yield not allowed inside race: watchers"}]
    },
    {
      code: "function* test() { yield race([yield call(watcher1), call(watcher2)]) }",
      output: "function* test() { yield race([call(watcher1), call(watcher2)]) }",
      errors: [{message: "yield not allowed inside race array at index: 0"}]
    },
    {
      code: "function* foo() { const actions = ['LOGIN', 'LOGOUT']; yield race(yield actions.map(take)) }",
      output: "function* foo() { const actions = ['LOGIN', 'LOGOUT']; yield race(actions.map(take)) }",
      errors: [{message: "yield not allowed inside race"}]
    },
    {
      code: "function* foo() { const actions = ['LOGIN', 'LOGOUT']; yield race(actions.every(take)) }",
      errors: [{message: "race must have Array.map as the only argument"}]
    }
  ]
})

