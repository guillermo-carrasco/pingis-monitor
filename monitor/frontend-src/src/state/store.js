import { createStore, applyMiddleware, compose } from 'redux'
import { createEpicMiddleware } from 'redux-observable'

import rootEpic from './rootEpic'
import rootReducer from './rootReducer'

let middleware
// eslint-disable-next-line no-underscore-dangle
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware = compose(
    applyMiddleware(createEpicMiddleware(rootEpic)),
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__()
  )
} else {
  middleware = applyMiddleware(createEpicMiddleware(rootEpic))
}

const store = createStore(
  rootReducer,
  middleware
)

export default store
