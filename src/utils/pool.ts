import { ChainEnum } from './chain'
import RECEIVABLE_FACTORING_POOL_ABI from '../abis/ReceivableFactoringPool.json'
import BASE_POOL_CONFIG_ABI from '../abis/BasePoolConfig.json'
import BASE_CREDIT_POOL_ABI from '../abis/BaseCreditPool.json'
import HDT_ABI from '../abis/HDT.json'
import { IconType } from '../utilTypes'
import { UsdcIcon } from '../components/icons'

export enum POOL_NAME {
  RequestNetowrk = 'RequestNetowrk',
  HumaCreditLine = 'HumaCreditLine',
}

export enum POOL_TYPE {
  Invoice = 'Invoice',
  CreditLine = 'CreditLine',
}

export type PoolMapType = {
  [poolType in POOL_TYPE]: {
    [poolName: string]: {
      name: string
      borrowDesc: string
      lendDesc: string
    }
  }
}

export type PoolInfoType = {
  basePoolConfig: string
  pool: string
  poolFeeManager: string
  poolUnderlyingToken: {
    address: string
    symbol: string
    decimals: number
    icon: IconType
  }
  assetAddress?: string
  poolName: POOL_NAME
  poolType: POOL_TYPE
  poolAbi: unknown
  basePoolConfigAbi: unknown
  HDT: {
    address: string
    abi: unknown
  }
}

export type PoolContractMapType = {
  [chainId: number]: {
    subgraph: string
    [POOL_TYPE.Invoice]: {
      [poolName: string]: PoolInfoType
    }
    [POOL_TYPE.CreditLine]: {
      [poolName: string]: PoolInfoType
    }
  }
}

export const PoolMap: PoolMapType = {
  [POOL_TYPE.CreditLine]: {
    [POOL_NAME.HumaCreditLine]: {
      name: 'Huma Credit Line',
      borrowDesc:
        'Credit lines backed by your future crypto income. Only available to the members of partner DAOs during beta.',
      lendDesc:
        'Earn active yield by participating in credit lines backed by on-chain income. Only available to the members of partner DAOs during beta.',
    },
  },
  [POOL_TYPE.Invoice]: {
    [POOL_NAME.RequestNetowrk]: {
      name: 'Request Network',
      borrowDesc:
        'Invoice factoring for your crypto invoices, up to 80% of their value. Only available to select invoicing platforms.',
      lendDesc:
        'Earn active yield by participating in this crypto invoice factoring market where loans are backed by collateralized invoice NFTs and paid back automatically when the invoice is paid.',
    },
  },
}

export const PoolContractMap: PoolContractMapType = {
  [ChainEnum.Polygon]: {
    subgraph: 'https://api.thegraph.com/subgraphs/name/00labs/huma-polygon',
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.HumaCreditLine]: {
        basePoolConfig: '0x39f7D6040EC30B62c508723e2EDb822413837527',
        pool: '0xAb3dc5221F373Dd879BEc070058c775A0f6Af759',
        poolFeeManager: '0x65C5535735581039c5711A9d7c223cff9384334F',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: UsdcIcon,
        },
        poolName: POOL_NAME.HumaCreditLine,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x73c16Db24951135BC8A628185BdbfA79115793E5',
          abi: HDT_ABI,
        },
      },
    },
    [POOL_TYPE.Invoice]: {
      [POOL_NAME.RequestNetowrk]: {
        basePoolConfig: '0x98f41d57C06b302AFf999f3F58f4ae7a3F884590',
        pool: '0x58AAF1f9cB10F335111A2129273056bbED251B61',
        poolFeeManager: '0x5B7841b94a3C7246662ef514745b034A6ceaAB15',
        poolUnderlyingToken: {
          address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
          symbol: 'USDC',
          decimals: 6,
          icon: UsdcIcon,
        },
        assetAddress: '0xf98B8A94eDBc9628B7b2141465980f2c3ACab23F',
        poolName: POOL_NAME.RequestNetowrk,
        poolType: POOL_TYPE.Invoice,
        poolAbi: RECEIVABLE_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0xf5F9297c74e464933e42F4a989e81D931fb20f83',
          abi: HDT_ABI,
        },
      },
    },
  },
  [ChainEnum.Goerli]: {
    subgraph:
      'https://api.studio.thegraph.com/query/35118/huma-credit-lines/v0.1.1',
    [POOL_TYPE.CreditLine]: {
      [POOL_NAME.HumaCreditLine]: {
        basePoolConfig: '0x0d7bae0e14aF194e52Ea2472737b24044fe6e929',
        pool: '0xA22D20FB0c9980fb96A9B0B5679C061aeAf5dDE4',
        poolFeeManager: '0x673b3C1094AE941bb4b2eF9377DaFE3bcCc4b003',
        poolUnderlyingToken: {
          address: '0xf17FF940864351631b1be3ac03702dEA085ba51c',
          symbol: 'USDC',
          decimals: 6,
          icon: UsdcIcon,
        },
        poolName: POOL_NAME.HumaCreditLine,
        poolType: POOL_TYPE.CreditLine,
        poolAbi: BASE_CREDIT_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x61341186E8C3B7cC0De66ae86C65943797C8Fb99',
          abi: HDT_ABI,
        },
      },
    },
    [POOL_TYPE.Invoice]: {
      [POOL_NAME.RequestNetowrk]: {
        basePoolConfig: '0xBa779F41ae414dEc63265D79a02DED47fbe007a5',
        pool: '0x11672c0bBFF498c72BC2200f42461c0414855042',
        poolFeeManager: '0x7BA6B8eBC9b09c228582814D44D4a0F2B6B0B9E4',
        poolUnderlyingToken: {
          address: '0xf17FF940864351631b1be3ac03702dEA085ba51c',
          symbol: 'USDC',
          decimals: 6,
          icon: UsdcIcon,
        },
        assetAddress: '0x9aEBB4B8abf7afC96dC00f707F766499C5EbeDF1',
        poolName: POOL_NAME.RequestNetowrk,
        poolType: POOL_TYPE.Invoice,
        poolAbi: RECEIVABLE_FACTORING_POOL_ABI,
        basePoolConfigAbi: BASE_POOL_CONFIG_ABI,
        HDT: {
          address: '0x27Fa332a5cA06492C2007FF4b143C921Cf779C3b',
          abi: HDT_ABI,
        },
      },
    },
  },
}
