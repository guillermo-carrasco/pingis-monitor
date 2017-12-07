import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import App from './App'

const render = (Component) => {
  const app = (
    <AppContainer>
      <Component />
    </AppContainer>
  )
  ReactDOM.render(app, window.document.getElementById('root'))
}

if (process.env.NODE_ENV === 'development' && module && module.hot) {
  module.hot.accept('./App', () => {
    render(App)
  })
}

render(App)
