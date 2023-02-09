import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import React, { useCallback, useEffect } from 'react'

import { sendTxAtom, txAtom } from '../../../hooks/useContractFunction'
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux'
import { isTxFailed } from '../../../utils/transaction'
import { WCProps } from '../../../utilTypes'
import { HumaModal, HumaModalHeader } from '../../humaModal'
import { resetState, setError } from '../store/widgets.reducers'
import { selectWidgetState } from '../store/widgets.selectors'
import { WIDGET_STEP } from '../store/widgets.store'

type Props = {
  isOpen: boolean
  handleClose: () => void
  handleSuccess: () => void
}

export function WidgetWrapper({
  isOpen,
  handleClose,
  handleSuccess,
  children,
}: WCProps<Props>): React.ReactElement | null {
  const dispatch = useAppDispatch()
  const { step } = useAppSelector(selectWidgetState)
  const [{ state, failReason, txReceipt }] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)

  useEffect(() => {
    if (isTxFailed(state) && failReason) {
      dispatch(setError({ errorMessage: failReason }))
    }
  }, [dispatch, failReason, state])

  useEffect(() => {
    if (step === WIDGET_STEP.Done && txReceipt) {
      handleSuccess()
    }
  }, [handleSuccess, step, txReceipt])

  const handleCloseModal = useCallback(() => {
    reset()
    dispatch(resetState())
    handleClose()
  }, [dispatch, handleClose, reset])

  // when close modal, return null to make sure all the states are reset
  if (!isOpen) {
    return null
  }

  return (
    <HumaModal
      isOpen={isOpen}
      overflowY='auto'
      onClose={handleCloseModal}
      width='480px'
      padding='30px 40px'
      disableBackdropClick
    >
      <HumaModalHeader onClose={handleCloseModal} height={0} />
      {children}
    </HumaModal>
  )
}
