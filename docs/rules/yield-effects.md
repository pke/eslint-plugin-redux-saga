# Ensures effects are yielded (yield-effects)

![](https://img.shields.io/badge/-recommended-lightgrey.svg "recommended") ![fixable](https://img.shields.io/badge/-fixable-green.svg "The `--fix` option on the command line automatically fixes problems reported by this rule.")

This rule ensures that all `redux-saga` effects are properly `yield`'ed.

Not `yield`'ing an effect might result in strange control flow behaviour.

```es6
import { take } from "redux-saga"

// good
function* good() {
  yield take("action")
}

// bad
function* bad() {
  take("action")
}
```

The `--fix` option on the command line automatically fixes problems reported by this rule.
