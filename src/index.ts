import type { Action, AnyAction } from 'redux'

import type { ThunkMiddleware } from './types'

export type {
  ThunkAction,
  ThunkDispatch,
  ThunkActionDispatch,
  ThunkMiddleware
} from './types'

/** A function that accepts a potential "extra argument" value to be injected later,
 * and returns an instance of the thunk middleware that uses that value
 */
function createThunkMiddleware<
  State = any,
  BasicAction extends Action = AnyAction,
  ExtraThunkArg = undefined
>(extraArgument?: ExtraThunkArg) { // 额外的参数 // +++
  // Standard Redux middleware definition pattern:
  // See: https://redux.js.org/tutorials/fundamentals/part-4-store#writing-custom-middleware
  const middleware: ThunkMiddleware<State, BasicAction, ExtraThunkArg> = // 赋值为这个函数1
    ({ dispatch, getState }) => // 函数1
    next => // 函数2 - 开发模式下就是在benxiaohaiw/redux-toolkit-source-analysis-v1.9.0/packages/toolkit/src/serializableStateInvariantMiddleware.ts中的action参数函数
    action => { // 函数3 - 开发模式下返回的这个函数将作为benxiaohaiw/redux-toolkit-source-analysis-v1.9.0/packages/toolkit/src/immutableStateInvariantMiddleware.ts下的next参数函数
      // The thunk middleware looks for any functions that were passed to `store.dispatch`.
      // If this "action" is really a function, call it and return the result.
      if (typeof action === 'function') { // action是一个函数 // +++
        // Inject the store's `dispatch` and `getState` methods, as well as any "extra arg"
        return action(dispatch, getState, extraArgument) // 额外的参数
        // 执行这个函数
      }

      // +++
      // 否则，照常将action传递到中间件链 // +++
      // Otherwise, pass the action down the middleware chain as usual
      return next(action) // next函数 // +++ 前一个中间件函数所返回的函数2执行后所返回的函数3是作为这里的函数2也就是next参数啦 ~
    }

  // 返回这个中间件函数 // +++
  return middleware
}

// 创建thunk中间件 // +++
const thunk = createThunkMiddleware() as ThunkMiddleware & {
  withExtraArgument<
    ExtraThunkArg,
    State = any,
    BasicAction extends Action = AnyAction
  >(
    extraArgument: ExtraThunkArg
  ): ThunkMiddleware<State, BasicAction, ExtraThunkArg>
}

// Attach the factory function so users can create a customized version
// with whatever "extra arg" they want to inject into their thunks
thunk.withExtraArgument = createThunkMiddleware // 对这个中间件函数增加withExtraArgument属性，值为createThunkMiddleware api
// 带有额外的参数

// 默认导出这个thunk中间件函数 // +++
export default thunk
