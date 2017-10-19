# eslint-plugin-redux-saga

[![Greenkeeper badge](https://badges.greenkeeper.io/pke/eslint-plugin-redux-saga.svg)](https://greenkeeper.io/)

[![Build Status](https://img.shields.io/travis/pke/eslint-plugin-redux-saga/master.svg?style=flat-square)](https://travis-ci.org/pke/eslint-plugin-redux-saga)
[![npm version](https://img.shields.io/npm/v/eslint-plugin-redux-saga.svg?style=flat-square)](https://badge.fury.io/js/eslint-plugin-redux-saga)
[![License](https://img.shields.io/npm/l/eslint-plugin-redux-saga.svg?style=flat-square)](LICENSE)

[ESLint](https://github.com/eslint/eslint) rules for [redux-saga](https://github.com/yelouafi/redux-saga).

## Usage

Install the plugin:

**npm**

`npm i -D eslint-plugin-redux-saga`

**yarn**

`yarn add -D eslint-plugin-redux-saga`

And add it to your `.eslintrc` file:

```json
{
  "plugins": [
    "redux-saga"
  ]
}
```

 
## Rules

* Ensure effects are yielded - [yield-effects](docs/rules/yield-effects.md)
* Prevent usage of yield in race entries - [no-yield-in-race](docs/rules/no-yield-in-race.md)
* Ensures error handling on sagas - [no-unhandled-errors](docs/rules/no-unhandled-errors.md)

## Recommended configuration

This plugin exports the `recommended` configuration that enforces all the rules. To use it, add following property to `.eslintrc` file:

```json
{
  "extends": [
    "plugin:redux-saga/recommended"
  ]
}
```
