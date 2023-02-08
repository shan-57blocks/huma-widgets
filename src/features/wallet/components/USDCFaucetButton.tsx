import { Button, css } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import { ReactElement, useCallback, useEffect, useState } from 'react'

import { HumaModal, HumaModalHeader } from '../../../components/humaModal'
import { useTestERC20Contract } from '../../../hooks/useContract'
import { sendTxAtom, txAtom } from '../../../hooks/useContractFunction'
import { ChainEnum } from '../../../utils/chain'
import { logAction } from '../../../utils/ddLogger'
import { TxStateType } from '../../../utils/transaction'
import { ErrorModal, LoadingModal, TxDoneModal } from '../../sdk/components'
import { ViewOnExplorer } from '../../sdk/components/ViewOnExplorer'

type Props = {
  chainId: number | undefined
  variant?: 'outlined' | 'contained'
}

export function USDCFaucetButton({
  chainId,
  variant = 'outlined',
}: Props): ReactElement {
  // Hardcode test USDC contract since this button only shows on Goerli
  const { account, provider } = useWeb3React()
  const testUSDCContract = useTestERC20Contract(
    '0xf17FF940864351631b1be3ac03702dEA085ba51c',
  )
  const [{ loading, state, txHash, failReason }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)
  const [mintSuccess, setMintSuccess] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'Minting' | 'Done' | 'Error'>('Minting')

  useEffect(() => {
    if (state === TxStateType.Success) {
      setStep('Done')
      setMintSuccess(true)
    }
    if (failReason) {
      setStep('Error')
    }
  }, [failReason, state])

  const styles = {
    faucetButton: css`
      margin-right: 5px;
    `,
  }

  const mintTestTokens = useCallback(() => {
    send({
      contract: testUSDCContract!,
      method: 'give1000To',
      params: [account],
      provider,
    })
  }, [account, testUSDCContract, provider, send])

  const onClickButton = () => {
    setIsOpen(true)
    mintTestTokens()
    logAction('Mint test usdc')
  }

  const handleCloseModal = () => {
    reset()
    setIsOpen(false)
    if (step !== 'Done') {
      setStep('Minting')
    }
  }

  if (chainId !== ChainEnum.Goerli) {
    return <div />
  }

  let text = 'Get Test USDC'
  if (mintSuccess) {
    text = 'Success!'
  } else if (loading) {
    text = 'Waiting...'
  }

  return (
    <>
      <Button
        css={styles.faucetButton}
        disabled={loading || mintSuccess}
        variant={variant}
        onClick={onClickButton}
      >
        {text}
      </Button>
      <HumaModal
        isOpen={isOpen}
        overflowY='auto'
        onClose={handleCloseModal}
        width='480px'
        padding='30px 40px'
        disableBackdropClick
      >
        <HumaModalHeader onClose={handleCloseModal} height={0} />
        {step === 'Minting' && (
          <LoadingModal
            title='Transaction Pending'
            description='Waiting for confirmation...'
          >
            <ViewOnExplorer txHash={txHash} />
          </LoadingModal>
        )}
        {step === 'Done' && (
          <TxDoneModal
            content={['You have successfully minted 1000 test USDC.']}
            handleAction={handleCloseModal}
          />
        )}
        {step === 'Error' && (
          <ErrorModal
            title='Supply'
            errorReason='Sorry there was an error'
            errorMessage={failReason}
            handleOk={handleCloseModal}
          />
        )}
      </HumaModal>
    </>
  )
}
