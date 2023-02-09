import type { AddEthereumChainParameter } from '@web3-react/types'
import { EthereumIcon, PolygonIcon } from '../components/icons'
import { IconType } from '../utilTypes'
import configUtil from './config'

const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
}

const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'MATIC',
  symbol: 'MATIC',
  decimals: 18,
}

interface BasicChainInformation {
  urls: string[]
  name: string
  icon: IconType
  explorer: string
  wait: number
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency']
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls']
}

export enum ChainEnum {
  // Mainnet = 1,
  Polygon = 137,
  Goerli = 5,
}

export const SupportedChainIds = [ChainEnum.Polygon, ChainEnum.Goerli]

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation
} = {
  // [ChainEnum.Mainnet]: {
  //   urls: [configUtil.InfuraRpcUrl, configUtil.AlchemyRpcUrl],
  //   name: 'Mainnet',
  //   nativeCurrency: ETH,
  //   icon: EthereumIcon,
  //   explorer: 'https://etherscan.io/tx',
  //   wait: 6,
  // },
  [ChainEnum.Polygon]: {
    urls: [configUtil.InfuraRpcUrl, configUtil.AlchemyRpcUrl],
    name: 'Polygon',
    nativeCurrency: MATIC,
    icon: PolygonIcon,
    explorer: 'https://polygonscan.com/tx',
    wait: 6,
  },
  [ChainEnum.Goerli]: {
    urls: [configUtil.InfuraRpcUrl, configUtil.AlchemyRpcUrl],
    name: 'Goerli',
    nativeCurrency: ETH,
    icon: EthereumIcon,
    explorer: 'https://goerli.etherscan.io/tx',
    wait: 1,
  },
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation,
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency
}

export function getAddChainParameters(
  chainId: number,
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId]
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
    }
  }
  return chainId
}

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS,
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }

  return accumulator
}, {})

export const getWalletAddressAbbr = (address: string) => {
  if (!address) {
    return address
  }
  const { length } = address
  return `${address.slice(0, 6)}...${address.slice(length - 4, length)}`
}

/**
 * Returns the input chain ID if chain is supported. If not, return undefined
 * @param chainId a chain ID, which will be returned if it is a supported chain ID
 */
export function supportedChainId(
  chainId: number | undefined,
): ChainEnum | undefined {
  if (typeof chainId === 'number' && chainId in ChainEnum) {
    return chainId
  }
  return undefined
}
