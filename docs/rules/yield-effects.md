# Ensures effects are yielded (yield-effects)

![](https://img.shields.io/badge/-recommended-lightgrey.svg "recommended") ![suggestion fixable](https://img.shields.io/badge/-suggestion%20fixable-green.svg "Editors that supports eslint suggestions will provide a fix option")

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

Note: There is no autofix for this rule since it would change the runtime behavior of the code and potentially break things. This would goes against the eslint [best practices for fixes](https://eslint.org/docs/developer-guide/working-with-rules#applying-fixes-1). If you use an editor that supports the eslint [suggestions API](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions), however, (for example the [VSCode ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)), the editor will provide a suggestion for how to fix it.
