# Ensures effects are yielded (yield-effects)

**recommended**

**fixable**<br>
The `--fix` option on the command line automatically fixes problems reported by this rule.


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
