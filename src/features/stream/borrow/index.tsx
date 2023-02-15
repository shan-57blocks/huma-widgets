import { Box } from '@mui/material'
import React, { useState } from 'react'

import { StreamFactoringBorrow } from '../../../components/widgets/StreamFactoring/borrow'

export function StreamBorrow(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(true)
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
        payerAddress={payerAddress}
        superToken={fUSDCx}
        isOpen={isOpen}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </Box>
  )
}
