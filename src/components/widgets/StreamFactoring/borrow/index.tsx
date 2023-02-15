import React from 'react'

import { useAppSelector } from '../../../../hooks/useRedux'
import { WidgetWrapper } from '../../components/WidgetWrapper'
import { selectWidgetState } from '../../store/widgets.selectors'
import { WIDGET_STEP } from '../../store/widgets.store'
import Widget from '../../Widget'
import { Evaluation } from './Evaluation'

type Props = {
  payerAddress: string
  superToken: string
  isOpen: boolean
  handleClose: () => void
  handleSuccess: () => void
}

export function StreamFactoringBorrow({
  payerAddress,
  superToken,
  isOpen,
  handleClose,
  handleSuccess,
}: Props): React.ReactElement | null {
  const { step } = useAppSelector(selectWidgetState)

  return (
    <Widget>
      <WidgetWrapper
        isOpen={isOpen}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      >
        {step === WIDGET_STEP.Evaluation && (
          <Evaluation payerAddress={payerAddress} superToken={superToken} />
        )}
      </WidgetWrapper>
    </Widget>
  )
}
