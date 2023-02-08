import { Web3ReactHooks } from '@web3-react/core'
import { ConnectorType } from '../store/wallet.store'
import { hooks as metaMaskHooks, metaMask } from './metaMask'
import { hooks as walletConnectHooks, walletConnect } from './walletConnect'

export const connectors: {
  [x: string]: {
    connector: ConnectorType
    hooks: Web3ReactHooks
  }
} = {
  MetaMask: {
    connector: metaMask,
    hooks: metaMaskHooks,
  },
  WalletConnect: {
    connector: walletConnect,
    hooks: walletConnectHooks,
  },
}
