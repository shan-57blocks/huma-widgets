import MultiFormat from '@requestnetwork/multi-format'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from 'ethers'
import { useCallback } from 'react'

import { useInvoiceNFTContract } from '../../../hooks/useInvoiceNFTContract'
import RNService from '../../../services/RNService'
import { logError } from '../../../utils/ddLogger'
import { POOL_NAME } from '../../../utils/pool'

/* eslint-disable @typescript-eslint/no-use-before-define */
type InvoiceInfoType = {
  amount: string
  payer: string
  payee: string
}

export const useInvoice = (poolName: POOL_NAME) => {
  const { chainId } = useWeb3React()
  const invoiceNFTContract = useInvoiceNFTContract(poolName)

  const getInvoiceInfo = useCallback(
    async (tokenId: BigNumber) => {
      if (invoiceNFTContract && chainId) {
        const metadataBase64 = await invoiceNFTContract.tokenURI(tokenId)

        switch (poolName) {
          case POOL_NAME.RequestNetowrk:
            return getRNInvoiceMetadata(tokenId, metadataBase64, chainId)

          default:
            break
        }
      }
      return undefined
    },
    [chainId, invoiceNFTContract, poolName],
  )

  return { getInvoiceInfo }
}

const getRNRequestId = (
  tokenId: BigNumber,
  metadataBase64: string,
): string | null => {
  try {
    const metadata = Buffer.from(metadataBase64, 'base64').toString('ascii')
    const requestIdObj = { value: tokenId.toHexString(), type: metadata }
    return MultiFormat.serialize(requestIdObj)
  } catch (e) {
    logError(e)
    return null
  }
}

const getRNInvoiceMetadata = async (
  tokenId: BigNumber,
  metadataBase64: string,
  chainId: number,
): Promise<InvoiceInfoType | null> => {
  const requestId = getRNRequestId(tokenId, metadataBase64)
  if (!requestId) {
    return null
  }
  const requestInfo = await RNService.getRequestInfo(requestId, chainId)
  return {
    amount: requestInfo.expectedAmount,
    payee: requestInfo.payee.value,
    payer: requestInfo.payer?.value,
  }
}
