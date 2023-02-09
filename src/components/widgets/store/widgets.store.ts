import { ApproveInfoType } from '../../../services/EAService'

export enum WIDGET_TYPE {
  BORROW = 'BORROW',
  PAYMENT = 'PAYMENT',
}

export enum WIDGET_STEP {
  Evaluation = 'Evaluation',
  AddToAllowList = 'AddToAllowList',
  Borrow = 'Borrow',
  Done = 'Done',
  Error = 'Error',
}

export type WidgetState = {
  step: WIDGET_STEP
  type?: WIDGET_TYPE
  approveInfo?: ApproveInfoType
  borrowAmount?: number
  chargedFees?: number
  borrowAmountNet?: number
  remainder?: number
  errorMessage?: string
  errorReason?: string
}

export const initialWidgetState: WidgetState = {
  step: WIDGET_STEP.Evaluation,
}
