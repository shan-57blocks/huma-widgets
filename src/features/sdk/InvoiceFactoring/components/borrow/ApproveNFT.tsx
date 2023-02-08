import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useEffect } from 'react'

import { sendTxAtom, txAtom } from '../../../../../hooks/useContractFunction'
import { useInvoiceNFTContract } from '../../../../../hooks/useInvoiceNFTContract'
import { useAppDispatch } from '../../../../../hooks/useRedux'
import { PoolInfoType } from '../../../../../utils/pool'
import { TxStateType } from '../../../../../utils/transaction'
import { LoadingModal } from '../../../components'
import { ViewOnExplorer } from '../../../components/ViewOnExplorer'
import { setIFBorrowNextStep } from '../../store/invoiceFactoring.reducers'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function ApproveNFT({ poolInfo, tokenId }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const { provider } = useWeb3React()
  const [{ state, txHash }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)
  const invoiceNFTContract = useInvoiceNFTContract(poolInfo.poolName)

  useEffect(() => {
    if (state === TxStateType.Success) {
      reset()
      dispatch(setIFBorrowNextStep())
    }
  }, [dispatch, reset, state])

  useEffect(() => {
    send({
      contract: invoiceNFTContract!,
      method: 'approve',
      params: [poolInfo.pool, tokenId],
      provider,
    })
  }, [invoiceNFTContract, poolInfo.pool, provider, send, tokenId])

  return (
    <LoadingModal
      title='Approve Invoice Transfer'
      description='Waiting for approval confirmation...'
    >
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
