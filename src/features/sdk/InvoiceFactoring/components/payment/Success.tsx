import React from 'react'

import { useAppSelector } from '../../../../../hooks/useRedux'
import { PoolInfoType } from '../../../../../utils/pool'
import { TxDoneModal } from '../../../components/TxDoneModal'
import { selectIFState } from '../../store/receivableFactoring.selectors'

type Props = {
  poolInfo: PoolInfoType
  handleAction: () => void
}

export function Success({ poolInfo, handleAction }: Props): React.ReactElement {
  const { symbol } = poolInfo.poolUnderlyingToken
  const { paymentAmount, remainDueAmount } = useAppSelector(selectIFState)

  const content = [
    `You have successfully made a payment of ${paymentAmount} ${symbol}.`,
    `The remaining due amount is ${remainDueAmount} ${symbol}.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
