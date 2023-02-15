import { Box } from '@mui/material'
import React, { useState } from 'react'

import { StreamFactoringBorrow } from '../../../components/widgets/StreamFactoring/borrow'
import { ChainEnum } from '../../../utils/chain'
import { PoolContractMap, POOL_NAME, POOL_TYPE } from '../../../utils/pool'

export function StreamBorrow(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(true)
  const poolInfo =
    PoolContractMap[ChainEnum.Goerli][POOL_TYPE.Invoice][
      POOL_NAME.RequestNetwork
    ]
  const payerAddress = '0x13a9211986B491F398A14ca23a2FDefF3EE64244'
  const fUSDCx = '0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a'

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Box>
      <StreamFactoringBorrow
        poolInfo={poolInfo}
        payerAddress={payerAddress}
        superToken={fUSDCx}
        isOpen={isOpen}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </Box>
  )
}
