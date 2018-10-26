"use strict"

var miscEffects = ["delay"]

function knowEffects() {
  var other = Object.keys(require("redux-saga")).filter(function(effect) {
    return miscEffects.includes(effect)
  })

  var reduxSagaEffects
  try {
    reduxSagaEffects = require("redux-saga/lib/effects")
  } catch (err) {
    reduxSagaEffects = require("redux-saga/effects")
  }

  return Object.keys(reduxSagaEffects).concat(other)
}

function isEffectImport(value) {
  return /^redux-saga(\/effects)?/.test(value)
}

module.exports = {
  isEffectImport: isEffectImport,
  knowEffects: knowEffects
}
