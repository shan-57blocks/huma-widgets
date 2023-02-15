import React, { useCallback, useState } from 'react'

import { useAppDispatch, useAppSelector } from '../../../../hooks/useRedux'
import { useRFFeeManager } from '../../../../hooks/useRFPoolContract'
import { PoolInfoType } from '../../../../utils/pool'
import { ChooseAmountModal } from '../../components'
import { setBorrowInfo } from '../../store/widgets.reducers'
import { selectWidgetState } from '../../store/widgets.selectors'
import { WIDGET_STEP } from '../../store/widgets.store'

type Props = {
  poolInfo: PoolInfoType
}

export function ChooseAmount({ poolInfo }: Props): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { approveInfo } = useAppSelector(selectWidgetState)
  const { getFeesCharged } = useRFFeeManager(poolInfo.poolName)
  const [chargedFees, setChargedFees] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      if (approveInfo) {
        setCurrentAmount(newAmount)
        setChargedFees(getFeesCharged(newAmount))
      }
    },
    [approveInfo, getFeesCharged],
  )
  const handleAction = useCallback(() => {
    dispatch(
      setBorrowInfo({
        borrowAmount: currentAmount,
        chargedFees,
        nextStep: WIDGET_STEP.MintNFT,
      }),
    )
  }, [chargedFees, currentAmount, dispatch])

  if (!approveInfo) {
    return null
  }

  return (
    <ChooseAmountModal
      title='Choose Amount'
      description1='Access up to 100% of your stream value'
      sliderMax={approveInfo.creditLimit}
      currentAmount={currentAmount}
      tokenSymbol={approveInfo.tokenSymbol}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
      actionText='Mint NFT'
    />
  )
}
