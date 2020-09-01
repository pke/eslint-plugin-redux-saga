"use strict"
var rule = require("../../../lib/rules/no-unhandled-errors")
var RuleTester = require("eslint").RuleTester

var ruleTester = new RuleTester()

function buildTest(imports, code) {
  var result = (imports && (imports + ";")) || ""
  result += "function* test() { " + code + " }"
  return result
}

ruleTester.run("no-unhandled-errors", rule, {
  valid: [
    {
      code: buildTest(
        "import { take } from 'redux-saga'",
        "try { yield take('ACTION') } catch (e) { errorHandler(e) }"
      )
    },
    {
      code: buildTest(
        "import { take as t } from 'redux-saga'",
        "try { yield t('ACTION') } catch (e) { errorHandler(e) }"
      )
    },
    {
      code: buildTest(
        "import { take } from 'redux-saga/effects'",
        "try { yield take('ACTION') } catch (e) { errorHandler(e) }"
      )
    },
    {
      code: buildTest(null, "try { yield take('ACTION') } catch (e) { errorHandler(e) }")
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
        "try { yield call('ACTION') } catch (e) { errorHandler(e) }"
      )
    },
    {
      code: buildTest(
        "import { call } from 'redux-saga'",
        "try { someStuff() } catch (e) { yield call('ACTION') }"
      )
    },
    {
      code: buildTest(
        "import { call, fork } from 'redux-saga/effects'",
        "yield fork(function*(){})"
      )
    },
    {
      code: buildTest(
        "import { takeEvery, takeLatest, takeLeading, throttle } from 'redux-saga'",
        "yield takeEvery('ACTION', function*(){});" +
        "yield takeLatest('ACTION', function*(){});" +
        "yield takeLeading('ACTION', function*(){});" +
        "yield throttle('ACTION', function*(){})"
      )
    }
  ],
  invalid: [
    {
      code: buildTest("import { call } from 'redux-saga'", "yield call('ACTION')"),
      errors: [{message: "A Saga must handle its effects' errors (use try/catch)"}]
    },
    {
      code: buildTest("import { put as p } from 'redux-saga'", "yield p('ACTION')"),
      errors: [{message: "A Saga must handle its effects' errors (use try/catch)"}]
    },
    {
      code: buildTest(
        "import { call } from 'redux-saga'",
        "try { yield call('ACTION') } catch (e) { errorHandler(e) } yield call('ACTION')"
      ),
      errors: [{message: "A Saga must handle its effects' errors (use try/catch)"}]
    }
  ]
})
