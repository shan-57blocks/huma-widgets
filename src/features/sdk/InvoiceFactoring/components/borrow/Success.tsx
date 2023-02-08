import React from 'react'

import { useAppSelector } from '../../../../../hooks/useRedux'
import { TxDoneModal } from '../../../components/TxDoneModal'
import { selectIFState } from '../../store/receivableFactoring.selectors'

type Props = {
  handleAction: () => void
}

export function Success({ handleAction }: Props): React.ReactElement {
  const { requestLoanNet, remainder, approveInfo } =
    useAppSelector(selectIFState)

  const content = [
    `${requestLoanNet} ${approveInfo?.tokenSymbol} is now in your wallet.`,
    `The remaining ${remainder} ${approveInfo?.tokenSymbol} will be sent to your wallet when the invoice is paid.`,
  ]

  return <TxDoneModal handleAction={handleAction} content={content} />
}
