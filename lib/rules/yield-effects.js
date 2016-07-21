/**
 * @fileoverview Rule to enforce yield in front of effects
 * @author Philipp Kursawe
 */
/** eslint-disable semi */
"use strict"

module.exports = {
  meta: {
    docs: {
      description: "enforce yield in front of effects",
      category: "Possible Errors",
      recommended: true
    },
    fixable: "code",
    schema: []
  },

  create: function(context) {
    var effectNames = []
    return {
      "ImportDeclaration": function(node) {
        if (node.source.value === "redux-saga") {
          effectNames = node.specifiers.map(function(specifier) {
            return specifier.local.name
          })
        }
      },
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
}
