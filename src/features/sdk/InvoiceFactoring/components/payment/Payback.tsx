import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'

import { CreditRecordType } from '../../../../../hooks/usePoolContract'
import { useAppDispatch } from '../../../../../hooks/useRedux'
import { useRFPoolAllowance } from '../../../../../hooks/useRFPoolContract'
import { downScale, toBigNumber, upScale } from '../../../../../utils/number'
import { PoolInfoType } from '../../../../../utils/pool'
import { ChooseAmountModal } from '../../../components'
import {
  setIFPaymentAmount,
  setIFPaymentStep,
} from '../../store/invoiceFactoring.reducers'
import { IF_PAYMENT_STEP } from '../../store/receivableFactoring.store'

type Props = {
  creditRecord: CreditRecordType
  poolInfo: PoolInfoType
}

export function Payback({
  creditRecord,
  poolInfo,
}: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { symbol, decimals } = poolInfo.poolUnderlyingToken
  const totalDue = downScale<number>(creditRecord.totalDue.toNumber(), decimals)
  const { allowance } = useRFPoolAllowance(poolInfo.poolName, account)
  const [remainingDue, setRemainingDue] = useState(totalDue)
  const [currentAmount, setCurrentAmount] = useState(0)

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      setCurrentAmount(newAmount)
      const remainDueAmount = totalDue - newAmount
      setRemainingDue(remainDueAmount)
      dispatch(
        setIFPaymentAmount({ paymentAmount: newAmount, remainDueAmount }),
      )
    },
    [dispatch, totalDue],
  )

  const handleAction = useCallback(() => {
    const payAmount = upScale(currentAmount, decimals)
    const nextStep = toBigNumber(payAmount).gt(allowance)
      ? IF_PAYMENT_STEP.ApproveAllowance
      : IF_PAYMENT_STEP.TransferMoney
    dispatch(setIFPaymentStep(nextStep))
  }, [allowance, currentAmount, decimals, dispatch])

  return (
    <ChooseAmountModal
      title='Make the payment'
      description1='Choose amount'
      sliderMax={totalDue}
      currentAmount={currentAmount}
      tokenSymbol={symbol}
      topLeft='Total Due'
      topRight={`${totalDue} ${symbol}`}
      downLeft='Remaining Due'
      downRight={`${remainingDue} ${symbol}`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='make payment'
    />
  )
}
