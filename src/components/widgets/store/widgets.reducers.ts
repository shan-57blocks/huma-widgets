import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ApproveInfo } from '../../../services/EAService'

import { initialWidgetState, WIDGET_STEP } from './widgets.store'

export const widgetSlice = createSlice({
  name: 'widget',
  initialState: initialWidgetState,
  reducers: {
    resetState: (state) => {
      state.errorReason = ''
      state.errorMessage = ''
      state.step = WIDGET_STEP.Evaluation
      state.approveInfo = undefined
      state.borrowAmount = undefined
      state.chargedFees = undefined
      state.borrowAmountNet = undefined
      state.remainder = undefined
    },
    setStep: (state, { payload }: PayloadAction<WIDGET_STEP>) => {
      state.step = payload
    },
    setApproveInfo: (state, { payload }: PayloadAction<ApproveInfo>) => {
      state.approveInfo = payload
      if (payload.creditLimit > 0) {
        state.step = WIDGET_STEP.Borrow
      } else {
        state.errorMessage =
          'Sorry, there was an error with your transaction. Please try submitting again.'
        state.step = WIDGET_STEP.Error
      }
    },
    setBorrowInfo: (
      state,
      {
        payload,
      }: PayloadAction<{
        borrowAmount: number
        chargedFees: number
        nextStep: WIDGET_STEP
      }>,
    ) => {
      state.borrowAmount = payload.borrowAmount
      state.chargedFees = payload.chargedFees
      state.borrowAmountNet = payload.borrowAmount - payload.chargedFees
      state.step = payload.nextStep
    },
    setError: (
      state,
      {
        payload,
      }: PayloadAction<{ errorMessage: string; errorReason?: string }>,
    ) => {
      state.errorMessage = payload.errorMessage
      state.errorReason = payload.errorReason
      state.step = WIDGET_STEP.Error
    },
  },
})

export const { resetState, setStep, setApproveInfo, setBorrowInfo, setError } =
  widgetSlice.actions

export default widgetSlice.reducer
