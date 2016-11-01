"use strict"

function knowEffects() {
  return Object.keys(require("redux-saga/lib/effects"))
}

function isEffectImport(value) {
  return /^redux-saga(\/effects)?/.test(value)
}

module.exports = {
  isEffectImport: isEffectImport,
  knowEffects: knowEffects
}
