"use strict"
var rule = require("../../../lib/rules/yield-effects")
var RuleTester = require("eslint/lib/testers/rule-tester")

var ruleTester = new RuleTester()

function buildTest(imports, code) {
  var result = (imports && (imports + ";")) || ""
  result += "function* test() { " + code + " }"
  return result
}

ruleTester.run("yield-effects", rule, {
  valid: [
    {
      code: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')")
    },
    {
      code: buildTest("import { delay } from 'redux-saga'", "yield delay(1000)")
    },
    {
      code: buildTest("import { take } from 'redux-saga/effects'", "yield take('ACTION')")
    },
    {
      code: buildTest("import { take as t } from 'redux-saga'", "yield t('ACTION')")
    },
    {
      code: buildTest("import { delay as d } from 'redux-saga'", "yield d(1000)")
    },
    {
      // If it is an effect name but not imported from `redux-saga` then its valid
      code: buildTest(null, "take('ACTION')")
    },
    {
      // If it is an effect name but not imported from `redux-saga` then its valid
      code: buildTest(null, "delay(1000)")
    },
    {
      code: buildTest("import { take } from 'redux-saga'", "notAnEffectDoesNotNeedYield()")
    },
    {
      code: "import createSagaMiddleware from 'redux-saga'; const sagaMiddleware = createSagaMiddleware();"
    },
    {
      code: buildTest("import { noop } from 'redux-saga'", "noop()")
    },
    {
      code: buildTest(
        "import { call } from 'redux-saga'",
        "const [foo, bar] = yield [call(something), call(somethingElse)]"
      )
    },
    {
      code:
        "import { put } from 'redux-saga';\n" +
        "expect(generator.next().value).toEqual(put({}));"
    },
    {
      code: buildTest(
        "import { call, all, delay, fetchResources } from 'redux-saga'",
        "yield all([" +
        "call(fetchResource, 'users')," +
        "call(fetchResource, 'comments')," +
        "call(delay, 1000)" +
        "])"
      )
    },
    {
      code:
        "import { takeEvery } from 'redux-saga';\n" +
        "export const fooSagas = [" +
        "takeEvery('FOO_A', fooASaga)," +
        "takeEvery('FOO_B', fooBSaga)];"
    },
    {
      code:
        "import { call } from 'redux-saga';\n" +
        "export class FooSaga {" +
        "static* someSaga() {" +
        "  yield call(() => {})" +
        "}" +
        "}"
    }
  ],
  invalid: [
    {
      code: buildTest("import { take } from 'redux-saga'", "take('ACTION')"),
      output: buildTest("import { take } from 'redux-saga'", "yield take('ACTION')"),
      errors: [{message: "take effect must be yielded"}]
    },
    {
      code: buildTest("import { delay } from 'redux-saga'", "delay('ACTION')"),
      output: buildTest("import { delay } from 'redux-saga'", "yield delay('ACTION')"),
      errors: [{message: "delay effect must be yielded"}]
    },
    {
      code: buildTest("import { take as t } from 'redux-saga'", "t('ACTION')"),
      output: buildTest("import { take as t } from 'redux-saga'", "yield t('ACTION')"),
      errors: [{message: "t (take) effect must be yielded"}]
    },
    {
      code: buildTest("import { delay as d } from 'redux-saga'", "d('ACTION')"),
      output: buildTest("import { delay as d } from 'redux-saga'", "yield d('ACTION')"),
      errors: [{message: "d (delay) effect must be yielded"}]
    },
    {
      code:
        "import { call } from 'redux-saga';\n" +
        "export class FooSaga {" +
        "static* someSaga() {" +
        "  call(() => {})" +
        "}" +
        "}",
      output:
        "import { call } from 'redux-saga';\n" +
        "export class FooSaga {" +
        "static* someSaga() {" +
        "  yield call(() => {})" +
        "}" +
        "}",
      errors: [{message: "call effect must be yielded"}]
    }
  ]
})
