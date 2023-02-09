import { Box, Button, css, useTheme } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import React, { useCallback, useState } from 'react'
import { CheckCircleIcon } from '../../icons'
import EAService from '../../../services/EAService'
import {
  EARejectMessageWithAllowList,
  EARejectReason,
} from '../../../utils/const'
import { logAction } from '../../../utils/ddLogger'
import { PoolInfoType } from '../../../utils/pool'
import { CustomError } from '../../../utilTypes'
import { ErrorModal } from './ErrorModal'
import { LoadingModal } from './LoadingModal'
import { WrapperModal } from './WrapperModal'

type Props = {
  poolInfo: PoolInfoType
  handleSuccess: () => void
  handleError: (errorMessage: string) => void
}

export function AllowListModal({
  poolInfo,
  handleSuccess,
  handleError,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const { account } = useWeb3React()
  const [status, setStatus] = useState<
    'notApproved' | 'approving' | 'approved'
  >('notApproved')

  const styles = {
    congratsWrapper: css`
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      padding: 0 16px;
      ${theme.cssMixins.rowVCentered}
      margin-top: 60px;
      height: 52px;
      background: linear-gradient(
          0deg,
          rgba(255, 255, 255, 0.9),
          rgba(255, 255, 255, 0.9)
        ),
        #2e7d32;
      border-radius: 4px;
    `,
    bottom: css`
      & .MuiButtonBase-root {
        width: 100%;
        position: absolute;
        bottom: 0;
      }
    `,
  }

  const addToAllowList = useCallback(async () => {
    try {
      setStatus('approving')
      await EAService.addToAllowList(account!, poolInfo.pool)
      setStatus('approved')
      logAction('Add to allowlist')
    } catch (e) {
      const error = e as CustomError
      handleError(error.message)
    }
  }, [account, handleError, poolInfo.pool])

  const continueToBorrow = () => {
    handleSuccess()
  }

  if (status === 'approving') {
    return (
      <LoadingModal
        title='Add To Allowlist'
        description='Waiting for approval confirmation...'
      />
    )
  }

  if (status === 'approved') {
    return (
      <WrapperModal title='Add To Allowlist'>
        <>
          <Box css={styles.congratsWrapper}>
            <CheckCircleIcon />
            <Box sx={{ marginLeft: '6px' }}>
              Congrats, you have been added to the allowlist
            </Box>
          </Box>
          <Box css={styles.bottom}>
            <Button variant='contained' onClick={continueToBorrow}>
              CONTINUE TO BORROW
            </Button>
          </Box>
        </>
      </WrapperModal>
    )
  }

  return (
    <ErrorModal
      title='Application Not Approved'
      errorReason={EARejectReason}
      errorMessage={EARejectMessageWithAllowList}
      handleOk={addToAllowList}
      okText='ADD ME TO ALLOWLIST'
    />
  )
}
