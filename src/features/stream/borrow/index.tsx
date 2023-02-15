import { Box } from '@mui/material'
import React, { useState } from 'react'

import { InvoiceFactoringBorrowWidget } from '../../../components/widgets/InvoiceFactoring'
import { ChainEnum } from '../../../utils/chain'
import { PoolContractMap, POOL_NAME, POOL_TYPE } from '../../../utils/pool'

export function StreamBorrow(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(true)
  const tokenId =
    '26337444204170564170797783893924018297742414848733412072645327877464077162747'
  const poolInfo =
    PoolContractMap[ChainEnum.Goerli][POOL_TYPE.Invoice][
      POOL_NAME.RequestNetwork
    ]

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Box>
      <InvoiceFactoringBorrowWidget
        tokenId={tokenId}
        poolInfo={poolInfo}
        isOpen={isOpen}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </Box>
  )
}
