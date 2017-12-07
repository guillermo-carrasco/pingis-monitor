import React from 'react'
import { Provider } from 'react-redux'
import 'common/scss/global.scss'

import ItWorks from '../components/ItWorks'

import store from '../state/store'

const App = () => (
  <Provider store={store}>
    <ItWorks />
  </Provider>
)

export default App
