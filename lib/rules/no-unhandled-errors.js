/**
 * @fileoverview Rule to enforce error handling on sagas
 * @author Nicolas @BuraBure Fernandez
 */
/** eslint-disable semi */
"use strict"

var knowEffects = Object.keys(require("redux-saga/lib/effects"))

function hasParentTryStatement (ancestors) {
  for (var i = (ancestors.length - 1); i > 0; i--) {
    if (ancestors[i].type === "TryStatement") {
      return true
    }
  }
  return false
}

module.exports = {
  meta: {
    docs: {
      description: "enforce error handling on sagas",
      category: "Possible Errors",
      recommended: true
    },
    schema: []
  },

  create: function(context) {
    var effectLocalNames = []
    var effectImportedNames = []
    return {
      "ImportDeclaration": function(node) {
        if (/^redux-saga(\/effects)?/.test(node.source.value)) {
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
          if (!hasParentTryStatement(context.getAncestors())) {
            context.report({
              node: node,
              message: "A Saga must handle its effects' errors (use try/catch)"
            })
          }
        }
      }
    }
  }
}
