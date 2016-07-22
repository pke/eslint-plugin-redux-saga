# Ensures effects are yielded (yield-effects)

**recommended**

**fixable**<br>
The `--fix` option on the command line automatically fixes problems reported by this rule.

This rule ensures that no `redux-saga` effects are (accidentally) overriden
by a function with the same name in the scope and are properly `yield`'ed.

Overriding or not `yield`'ing an effect might result in unexpected saga control flow behaviour.


## Examples

### Overriding effects

```es6
import { take, put as sagaPut } from "redux-saga"

// good
function* good() {
  yield take("action")
}

// good
function* good() {  
  function put() {}
  
  yield sagaPut("action")
}

// good
function put() {  
}
  
function* good() {  
  yield sagaPut("action")
}


// bad
function* bad() {
  function take() {}
  
  yield take("action")
}

// bad
function take() {
}  
  
function* bad() {  
  yield take("action")
}
```

### Not `yield`'ing effects: 

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
