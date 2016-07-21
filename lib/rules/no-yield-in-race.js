/**
 * @fileoverview Rule to flag use of yield inside race effects
 * @author Philipp Kursawe
 */
/** eslint-disable semi */
"use strict"

module.exports = {
  meta: {
    docs: {
      description: "flag use of yield inside race effects",
      category: "Possible Errors",
      recommended: true
    },
    fixable: "code",
    schema: []
  },

  create: function(context) {
    return {
      "CallExpression": function(node) {
        var callee = node.callee
        if (callee.name === "race") {
          if (node.arguments.length !== 1 || node.arguments[0].type !== "ObjectExpression") {
            context.report(node, "race must have on object hash as the only argument")
          } else {
            var properties = node.arguments[0].properties
            properties.forEach(function(property) {
              var name = property.key.name
              if (property.value.type === "YieldExpression") {
                var yieldExpression = property.value
                context.report({
                  node: property,
                  message: "yield not allowed inside race: " + name,
                  fix: function(fixer) {
                    var nextToken = property.value.argument
                    return fixer.removeRange([yieldExpression.range[0], nextToken.range[0]])
                  }
                })
              }
            })
          }
        }
      }
    }
  }
}
