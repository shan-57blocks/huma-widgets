import React from 'react'

import { useAppSelector } from '../../../hooks/useRedux'
import { PoolInfoType } from '../../../utils/pool'
import { WidgetWrapper } from '../components/WidgetWrapper'
import { selectWidgetState } from '../store/widgets.selectors'
import { WIDGET_STEP } from '../store/widgets.store'
import { Evaluation } from './Evaluation'

type Props = {
  poolInfo: PoolInfoType
  isOpen: boolean
  tokenId: string
  handleClose: () => void
  handleSuccess: () => void
}

export function InvoiceFactoringBorrowWidget({
  poolInfo,
  tokenId,
  isOpen,
  handleClose,
  handleSuccess,
}: Props): React.ReactElement | null {
  const { step } = useAppSelector(selectWidgetState)

  return (
    <WidgetWrapper
      isOpen={isOpen}
      handleClose={handleClose}
      handleSuccess={handleSuccess}
    >
      {step === WIDGET_STEP.Evaluation && (
        <Evaluation poolInfo={poolInfo} tokenId={tokenId} />
      )}
    </WidgetWrapper>
  )
}
