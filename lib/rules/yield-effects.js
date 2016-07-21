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
    var self = this
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
          var scopeVariable = self.variableInScope(context, callee.name)
          if (scopeVariable) {
            context.report({
              node: scopeVariable.identifiers[0],
              message: scopeVariable.name + " overrides redux-saga effect with the same name"
            })
            return
          }
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
  },

  /**
   * Returns the variable that overrides an ImportBinding
   *
   * Contain a patch for babel-eslint to avoid https://github.com/babel/babel-eslint/issues/21
   *
   * @param {Object} context The current rule context.
   * @param {String} name The name of the variable to search.
   * @returns {Object} the found variable or null if none was found.
   *
   * based on:
   * https://github.com/yannickcr/eslint-plugin-react/blob/442d20b6e1bb5daeacd5234f253f963af90cc3e4/lib/util/variable.js#L61-L86
   */
  variableInScope: function(context, name) {
    var scope = context.getScope()
    var variables = scope.variables

    while (scope.type !== "module") {
      scope = scope.upper
      variables = scope.variables.concat(variables)
    }
    if (scope.childScopes.length) {
      variables = scope.childScopes[0].variables.concat(variables)
      if (scope.childScopes[0].childScopes.length) {
        variables = scope.childScopes[0].childScopes[0].variables.concat(variables)
      }
    }

    var result
    variables.some(function(variable) {
      if (variable.name === name) {
        if (variable.defs.some(function(def) {
          return def.type !== "ImportBinding"
        })) {
          result = variable
        }
      }
      return !!result
    })

    return result
  }
}
