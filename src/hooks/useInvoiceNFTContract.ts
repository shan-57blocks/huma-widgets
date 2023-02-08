import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'

import INVOICE_NFT_ABI from '../abis/InvoiceNFT.json'
import { InvoiceNFT } from '../abis/types/InvoiceNFT'
import { logError } from '../utils/ddLogger'
import { POOL_NAME, POOL_TYPE, PoolContractMap } from '../utils/pool'
import { useContract } from './useContract'

export function useInvoiceNFTContract(poolName: POOL_NAME) {
  const { chainId } = useWeb3React()
  const InvoiceNFTAddress = chainId
    ? PoolContractMap[chainId]?.[POOL_TYPE.Invoice][poolName]?.assetAddress
    : undefined
  return useContract<InvoiceNFT>(InvoiceNFTAddress, INVOICE_NFT_ABI)
}

export function useNFTIds(
  poolName: POOL_NAME,
  account?: string,
): [BigNumber[] | undefined, () => void] {
  const invoiceNFTContract = useInvoiceNFTContract(poolName)
  const [NFTTokenIds, setNFTTokenIds] = useState<BigNumber[]>()
  const [refreshCount, setRefreshCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (invoiceNFTContract && account) {
        try {
          const ids = await invoiceNFTContract.getIds(account)
          setNFTTokenIds(ids)
        } catch (error) {
          logError(error, { message: 'Error get invoice NFT Ids' })
          throw error
        }
      }
    }
    fetchData()
  }, [account, invoiceNFTContract, refreshCount])

  const refresh = useCallback(() => {
    setRefreshCount((pre) => pre + 1)
  }, [])

  return [NFTTokenIds, refresh]
}

export function useInvoiceNFTMetadata(poolName: POOL_NAME) {
  const invoiceNFTContract = useInvoiceNFTContract(poolName)

  const getTokenMetadatas = useCallback(
    async (tokenIds: string[]) => {
      if (!tokenIds || !invoiceNFTContract) {
        return
      }
      const getTokenMetadata = async (tokenId: string) => {
        const uri = await invoiceNFTContract.tokenURI(tokenId)
        const uriDecoded = atob(uri.split(',')[1])
        try {
          return JSON.parse(uriDecoded)
        } catch (error) {
          logError(error, {
            message: 'Error get invoice NFT metadata',
          })
          throw new Error(`Access invoice NFT metadata error.`)
        }
      }
      const result = await Promise.all(
        tokenIds.map((tokenId) => getTokenMetadata(tokenId)),
      )
      // eslint-disable-next-line consistent-return
      return result
    },
    [invoiceNFTContract],
  )

  return { getTokenMetadatas }
}

export function useInvoiceNFTApproved(poolName: POOL_NAME) {
  const invoiceNFTContract = useInvoiceNFTContract(poolName)

  const getApprovedBy = useCallback(
    async (tokenId: string) => {
      if (!tokenId || !invoiceNFTContract) {
        return undefined
      }
      const approvedAddr = await invoiceNFTContract.getApproved(tokenId)
      return approvedAddr
    },
    [invoiceNFTContract],
  )

  return { getApprovedBy }
}
