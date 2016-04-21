/**
 * @fileoverview Rule to enforce yield in front of effects
 * @author Philipp Kursawe
 */
"use strict" /** eslint-disable semi */

var effects = require("redux-saga/lib/effects")
var effectNames = Object.keys(effects)

module.exports = function(context) {
  return {
    "CallExpression": function(node) {
      var callee = node.callee
      if (effectNames.indexOf(callee.name) !== -1) {
        var sourceCode = context.getSourceCode()
        var previousTokens = sourceCode.getTokensBefore(node, 1)
        if (previousTokens[0].value !== "yield") {
          context.report({
            node: node,
            message: callee.name + " effect must be yielded",
            fix: function(fixer) {
              return fixer.insertTextBefore(node, "yield ")
            } 
          })
        }          
      }
    }
  }
}

module.exports.schema = [
    // JSON Schema for rule options goes here
]
