import React from 'react'
import { Provider } from 'react-redux'
import 'common/scss/global.scss'

import store from '../state/store'
import { PingPongStatus } from '../components/PingPongStatus'

const App = () => (
  <Provider store={store}>
    <PingPongStatus />
  </Provider>
)

export default App
