# Ensures error handling on sagas

![](https://img.shields.io/badge/-recommended-lightgrey.svg "recommended")

This rule ensures that all `redux-saga` effects are inside a try/catch block for error handling.

An uncaught error can cause all other sagas waiting to complete to be inadvertedly canceled.

```es6
import { call } from "redux-saga"

// good
function* good() {
  try {
    yield call(action)
  } catch (error) {
    yield call(handleError, error)
  }
}

// bad
function* bad() {
  call(action)
}
```
