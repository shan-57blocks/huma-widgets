import { ThemeProvider } from '@mui/material'
import { Buffer } from 'buffer'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './store'
import reportWebVitals from './reportWebVitals'
import { initRUMLogger } from './utils/ddLogger'
import { themeHuma } from './theme'
import { initSentry } from './utils/sentry'

// Initialize the Sentry module as early as possible, before initializing React
initSentry()

// Please refer to https://github.com/Uniswap/web3-react/issues/423
window.Buffer = window.Buffer || Buffer

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <Provider store={store}>
    <ThemeProvider theme={themeHuma}>
      <App />
    </ThemeProvider>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

initRUMLogger()
