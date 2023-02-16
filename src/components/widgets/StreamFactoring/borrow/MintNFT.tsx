import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import React from 'react'
import { sendTxAtom } from '../../../../hooks/useContractFunction'

import useMount from '../../../../hooks/useMount'
import { LoadingModal } from '../../components'
import { ViewOnExplorer } from '../../components/ViewOnExplorer'

type Props = {
  payerAddress: string
  superToken: string
}

export function MintNFT({
  payerAddress,
  superToken,
}: Props): React.ReactElement {
  const { provider } = useWeb3React()
  const [{ txHash }, send] = useAtom(sendTxAtom)

  // useMount(() => {
  //   send({
  //     contract: invoiceNFTContract!,
  //     method: 'approve',
  //     params: [poolInfo.pool, tokenId],
  //     provider,
  //   })
  // })

  return (
    <LoadingModal
      title='Checking Stream'
      description='Checking if the stream qualifies for factoring...'
    >
      {' '}
      <ViewOnExplorer txHash={txHash} />
    </LoadingModal>
  )
}
