# Prevent usage of yield in race entries (no-yield-in-race)

![](https://img.shields.io/badge/-recommended-lightgrey.svg "recommended") ![fixable](https://img.shields.io/badge/-fixable-green.svg "The `--fix` option on the command line automatically fixes problems reported by this rule.")

```es6
import { race, call } from "redux-saga"

// Good
function* good() {
  yield race({
    posts: call(fetchApis)
  })
}

function* good() {
  yield race({
    watchers: [call(watcher1), call(watcher2)]
  })
}

// Bad
function* bad() {
  yield race({ posts: yield call(fetchApis) })
}

function* bad() {
  yield race({
    watchers: yield [call(watcher1), call(watcher2)]
  })
}

```

The `--fix` option on the command line automatically fixes problems reported by this rule.
