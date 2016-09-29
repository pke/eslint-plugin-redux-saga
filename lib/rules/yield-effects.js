/**
 * @fileoverview Rule to enforce yield in front of effects
 * @author Philipp Kursawe
 */
/** eslint-disable semi */
"use strict"

var knowEffects = Object.keys(require("redux-saga/lib/effects"))

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
    var effectLocalNames = []
    var effectImportedNames = []
    return {
      "ImportDeclaration": function(node) {
        if (node.source.value === "redux-saga") {
          node.specifiers.forEach(function(specifier) {
            if (specifier.type === "ImportSpecifier" && knowEffects.indexOf(specifier.imported.name) !== -1) {
              effectLocalNames.push(specifier.local.name)
              effectImportedNames.push(specifier.imported.name)
            }
          })
        }
      },
      "CallExpression": function(node) {
        var callee = node.callee
        var localNameIndex = effectLocalNames.indexOf(callee.name)
        if (localNameIndex !== -1) {
          var importedName = effectImportedNames[localNameIndex]
          var effectName = callee.name
          if (importedName !== effectName) {
            effectName += " (" + importedName + ")"
          }
          var sourceCode = context.getSourceCode()
          var previousTokens = sourceCode.getTokensBefore(node, 1)
          if (previousTokens[0].value !== "yield") {
            context.report({
              node: node,
              message: effectName + " effect must be yielded",
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
