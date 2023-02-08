import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Button, css, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { useInvoiceNFTApproved } from '../../../../../hooks/useInvoiceNFTContract'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { isEmpty } from '../../../../../utils/common'
import { PoolInfoType } from '../../../../../utils/pool'
import { setIFBorrowStep } from '../../store/invoiceFactoring.reducers'
import { selectIFState } from '../../store/receivableFactoring.selectors'
import { IF_BORROW_STEP } from '../../store/receivableFactoring.store'

type Props = {
  poolInfo: PoolInfoType
  tokenId: string
}

export function Confirm({
  poolInfo,
  tokenId,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { requestLoanNet, approveInfo } = useAppSelector(selectIFState)
  const { getApprovedBy } = useInvoiceNFTApproved(poolInfo.poolName)
  const [tokenApproved, setTokenApproved] = useState<boolean>()

  useEffect(() => {
    const fetchData = async () => {
      const approvedAddr = await getApprovedBy(tokenId)
      if (
        !approvedAddr ||
        approvedAddr.toLowerCase() !== poolInfo.pool.toLowerCase()
      ) {
        setTokenApproved(false)
      } else {
        setTokenApproved(true)
      }
    }
    fetchData()
  }, [getApprovedBy, poolInfo.pool, tokenId])

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
      ${theme.cssMixins.colStretch};
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: -5px;
    `,
    description: css`
      font-weight: 500;
      font-size: 16px;
      color: #49505b;
      margin-top: 30px;
    `,
    transferWrapper: css`
      margin-top: 75px;
    `,
    transfer: css`
      ${theme.cssMixins.rowSpaceBetweened}
      ${theme.cssMixins.rowVCentered}
      height: 72px;
      background: #f9f8fa;
      border-radius: 4px;
      font-weight: 500;
      font-size: 16px;
      color: #49505b;
      padding: 24px 32px;
      margin-bottom: 9px;
      position: relative;
    `,
    arrow: css`
      color: #d2d0d6;
      position: absolute;
      margin: auto;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    `,
    okButton: css`
      width: 100%;
      position: absolute;
      bottom: 0;
    `,
  }

  const handleAction = async () => {
    const nextStep = tokenApproved
      ? IF_BORROW_STEP.TransferMoney
      : IF_BORROW_STEP.ApproveNFT
    dispatch(setIFBorrowStep(nextStep))
  }

  if (isEmpty(requestLoanNet) || isEmpty(approveInfo)) {
    return null
  }

  return (
    <Box css={styles.wrapper}>
      <Typography variant='h6' css={styles.header}>
        Confirm transaction details
      </Typography>
      <Box css={styles.description}>
        Huma keeps your Invoice NFT as collateral until it's fully paid.
      </Box>
      <Box css={styles.transferWrapper}>
        <Box css={styles.transfer}>
          <Box>Invoice NFT</Box>
          <ArrowForwardIosIcon css={styles.arrow} />
          <Box>Huma</Box>
        </Box>
        <Box css={styles.transfer}>
          <Box>
            {requestLoanNet!} {approveInfo?.tokenSymbol}
          </Box>
          <ArrowForwardIosIcon css={styles.arrow} />
          <Box>You</Box>
        </Box>
      </Box>
      <Button variant='contained' css={styles.okButton} onClick={handleAction}>
        {tokenApproved ? 'Accept Transfer' : 'Approve NFT'}
      </Button>
    </Box>
  )
}
