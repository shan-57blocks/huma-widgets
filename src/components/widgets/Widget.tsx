import { ThemeProvider } from '@mui/material'
import { Provider as AtomProvider } from 'jotai'
import { Provider as ReduxProvider } from 'react-redux'

import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from '../../hooks/web3'
import { store } from '../../store'
import { themeHuma } from '../../theme'
import { WCProps } from '../../utilTypes'

export default function Widget(props: WCProps) {
  const { children } = props
  return (
    <ThemeProvider theme={themeHuma}>
      <ReduxProvider store={store}>
        <Web3Provider {...(props as Web3Props)}>
          <AtomProvider>{children}</AtomProvider>
        </Web3Provider>
      </ReduxProvider>
    </ThemeProvider>
  )
}
