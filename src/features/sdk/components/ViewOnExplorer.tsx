import { Box, Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React from 'react'

import { CHAINS } from '../../../utils/chain'
import { openInNewTab } from '../../../utils/common'

type Props = {
  txHash: string
}

export function ViewOnExplorer({ txHash }: Props): React.ReactElement | null {
  const { chainId } = useWeb3React()
  const chain = chainId ? CHAINS[chainId] : null

  if (!txHash || !chain) {
    return null
  }

  return (
    <Button
      variant='outlined'
      onClick={() => openInNewTab(`${chain.explorer}/${txHash}`)}
    >
      <Box component='span'>VIEW ON EXPLORER</Box>
    </Button>
  )
}
