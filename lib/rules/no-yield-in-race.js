/**
 * @fileoverview Rule to flag use of yield inside race effects
 * @author Philipp Kursawe
 */
"use strict"

function checkYieldInObject(context, node) {
  var properties = node.arguments[0].properties
  for (var i = 0, len = properties.length; i < len; ++i) {
    var property = properties[i]
    var name = property.key.name
    if (property.value.type === "YieldExpression") {
      var yieldExpression = property.value
      context.report({
        node: property,
        message: "yield not allowed inside race: " + name,
        fix: function(fixer) {
          var nextToken = property.value.argument
          return fixer.removeRange([yieldExpression.start, nextToken.start])
        }
      })
    }
  }
}

function checkYieldInArray(context, node) {
  var elements = node.arguments[0].elements
  for (var i = 0, len = elements.length; i < len; ++i) {
    var element = elements[i]
    if (element.type === "YieldExpression") {
      var yieldExpression = element
      context.report({
        node: element,
        message: "yield not allowed inside race array at index: " + i,
        fix: function(fixer) {
          var nextToken = element.argument
          return fixer.removeRange([yieldExpression.start, nextToken.start])
        }
      })
    }
  }
}

function checkCallExpression(context, node) {
  var callee = node.arguments[0].callee
  var object = callee && callee.object
  if (object) {
    var name = object.name
    var foundVariable = context.getScope().variables.find(function(variable) {
      return variable.name === name
    })
    if (foundVariable) {
      var def = foundVariable.defs[foundVariable.defs.length - 1]
      if (def.node.init.type === "ArrayExpression" && callee.property.name !== "map") {
        context.report(node, "race must have Array.map as the only argument")
      }
    }
  }
}

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
          var type = node.arguments[0].type
          if (node.arguments.length !== 1) {
            context.report(node, "race must have on object hash or array as the only argument")
          } else if (type === "ObjectExpression") {
            checkYieldInObject(context, node)
          } else if (type === "ArrayExpression") {
            checkYieldInArray(context, node)
          } else if (type === "CallExpression") {
            checkCallExpression(context, node)
          } else if (type === "YieldExpression") {
            var yieldExpression = node.arguments[0]
            context.report({
              node: yieldExpression,
              message: "yield not allowed inside race",
              fix: function(fixer) {
                var nextToken = yieldExpression.argument
                return fixer.removeRange([yieldExpression.start, nextToken.start])
              }
            })
            return
          } else {
            context.report(node, "race must have on object hash or array as the only argument")
          }
        }
      }
    }
  }
}
