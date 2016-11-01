"use strict"

module.exports = function (importString) {
  return /^redux-saga(\/effects)?/.test(importString)
}
