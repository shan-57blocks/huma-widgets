import { MetaMask } from '@web3-react/metamask'
import { WalletConnect } from '@web3-react/walletconnect'

import { MetamaskIcon, WalletConnectIcon } from '../../../components/icons'
import { IconType } from '../../../utilTypes'

export type ConnectorType = MetaMask | WalletConnect
export type ProviderType = 'MetaMask' | 'WalletConnect'

export const ProviderInfos: {
  [x: string]: {
    icon: IconType
  }
} = {
  MetaMask: {
    icon: MetamaskIcon,
  },
  WalletConnect: {
    icon: WalletConnectIcon,
  },
}

export type WalletState = {
  isModalOpened: boolean
  choosenProvider?: ProviderType
  isConnecting?: boolean
  error?: Error
  connectors: {
    [provider: string]: ConnectorType
  }
}

export const initialWalletState: WalletState = {
  isModalOpened: false,
  connectors: {},
}
