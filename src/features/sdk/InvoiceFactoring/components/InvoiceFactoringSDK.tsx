import React from 'react'
import { Provider } from 'jotai'

import {
  CreditRecordType,
  ReceivableInfoType,
} from '../../../../hooks/usePoolContract'
import { PoolInfoType } from '../../../../utils/pool'
import { Borrow } from './borrow/Borrow'
import { Payment } from './payment/Payment'

type Props = {
  creditRecord: CreditRecordType
  receivableInfo: ReceivableInfoType
  poolInfo: PoolInfoType
  isOpen: boolean
  tokenId: string
  handleClose: () => void
  handleSuccess: (blockNumber: number) => void
  actionType: 'borrow' | 'payment'
}

export function InvoiceFactoringSDK({
  creditRecord,
  receivableInfo,
  poolInfo,
  tokenId,
  isOpen,
  handleClose,
  handleSuccess,
  actionType,
}: Props): React.ReactElement | null {
  // when close modal, return null to make sure all the states are reset
  if (!isOpen) {
    return null
  }

  if (actionType === 'borrow') {
    return (
      <Provider>
        <Borrow
          creditRecord={creditRecord}
          receivableInfo={receivableInfo}
          poolInfo={poolInfo}
          isOpen={isOpen}
          tokenId={tokenId}
          handleClose={handleClose}
          handleSuccess={handleSuccess}
        />
      </Provider>
    )
  }

  if (actionType === 'payment') {
    return (
      <Provider>
        <Payment
          creditRecord={creditRecord}
          poolInfo={poolInfo}
          isOpen={isOpen}
          handleClose={handleClose}
          handleSuccess={handleSuccess}
        />
      </Provider>
    )
  }

  return null
}
