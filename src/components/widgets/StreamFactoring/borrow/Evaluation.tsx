import { useWeb3React } from '@web3-react/core'
import React, { useEffect } from 'react'

import { LoadingModal } from '../../components'
import useEA from '../../hooks/useEA'

type Props = {
  payerAddress: string
  superToken: string
}

export function Evaluation({
  payerAddress,
  superToken,
}: Props): React.ReactElement {
  const { account } = useWeb3React()
  const { checkingEA } = useEA()

  useEffect(() => {
    if (account) {
      checkingEA({ payeeAddress: account, payerAddress, superToken })
    }
  }, [account, checkingEA, payerAddress, superToken])

  return (
    <LoadingModal
      title='Checking Stream'
      description='Checking if the stream qualifies for factoring...'
    />
  )
}
