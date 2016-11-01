# eslint-plugin-redux-saga

[![Build Status](https://img.shields.io/travis/pke/eslint-plugin-redux-saga/master.svg?style=flat-square)](https://travis-ci.org/pke/eslint-plugin-redux-saga)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-redux-saga.svg?style=flat-square)](https://badge.fury.io/js/eslint-plugin-redux-saga)
[![License](https://img.shields.io/npm/l/eslint-plugin-redux-saga.svg?style=flat-square)](LICENSE)

[ESLint](https://github.com/eslint/eslint) rules for [redux-saga](https://github.com/yelouafi/redux-saga).

## Rules

* Ensure effects are yielded - [yield-effects](docs/rules/yield-effects.md)
* Prevent usage of yield in race entries - [no-yield-in-race](docs/rules/no-yield-in-race.md)
* Ensures error handling on sagas - [no-unhandled-errors](docs/rules/no-unhandled-errors.md)
