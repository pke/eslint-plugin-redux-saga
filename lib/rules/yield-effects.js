/**
 * @fileoverview Rule to enforce yield in front of effects
 * @author Philipp Kursawe
 */
/** eslint-disable semi */
"use strict"

var Effects = require("../utils/effects")

var knowEffects = Effects.knowEffects()

module.exports = {
  meta: {
    docs: {
      description: "enforce yield in front of effects",
      category: "Possible Errors",
      recommended: true
    },
    hasSuggestions: true,
    schema: []
  },

  create: function(context) {
    var inYieldDepth = 0
    var inGeneratorDepth = 0
    var effectLocalNames = []
    var effectImportedNames = []

    function enterFunction(node) {
      if (node.generator) {
        ++inGeneratorDepth
      }
    }
    function exitFunction(node) {
      if (node.generator) {
        --inGeneratorDepth
      }
    }
    return {
      "ImportDeclaration": function(node) {
        if (Effects.isEffectImport(node.source.value)) {
          node.specifiers.forEach(function(specifier) {
            if (specifier.type === "ImportSpecifier" && knowEffects.indexOf(specifier.imported.name) !== -1) {
              effectLocalNames.push(specifier.local.name)
              effectImportedNames.push(specifier.imported.name)
            }
          })
        }
      },
      "FunctionDeclaration": enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      "FunctionExpression": enterFunction,
      "FunctionExpression:exit": exitFunction,
      "YieldExpression": function() {
        inYieldDepth += 1
      },
      "YieldExpression:exit": function() {
        inYieldDepth -= 1
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
          if (inYieldDepth === 0 && inGeneratorDepth) {
            context.report({
              node: node,
              message: effectName + " effect must be yielded",
              suggest: [
                {
                  desc: "Add yield",
                  fix: function(fixer) {
                    return fixer.insertTextBefore(node, "yield ")
                  }
                }
              ]
            })
          }
        }
      }
    }
  }
}
