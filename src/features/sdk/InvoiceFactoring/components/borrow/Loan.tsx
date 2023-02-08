import { Box, Button, css, Typography, useTheme } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { CreditRecordType } from '../../../../../hooks/usePoolContract'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useRedux'
import { useRFFeeManager } from '../../../../../hooks/useRFPoolContract'
import { PoolInfoType } from '../../../../../utils/pool'
import { ChooseAmountModal } from '../../../components'
import { setIFBorrowAmount } from '../../store/invoiceFactoring.reducers'
import {
  selectIFAlreadyApproved,
  selectIFApproveInfo,
} from '../../store/receivableFactoring.selectors'

type Props = {
  creditRecord: CreditRecordType
  poolInfo: PoolInfoType
  handleOk: () => void
}

export function Loan({
  creditRecord,
  poolInfo,
  handleOk,
}: Props): React.ReactElement | null {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const approveInfo = useAppSelector(selectIFApproveInfo)
  const alreadyApproved = useAppSelector(selectIFAlreadyApproved)
  const { getFeesCharged } = useRFFeeManager(poolInfo.poolName)
  const [chargedFees, setChargedFees] = useState(0)
  const [remainder, setRemainder] = useState(0)
  const [currentAmount, setCurrentAmount] = useState(0)

  useEffect(() => {
    if (approveInfo) {
      setRemainder(approveInfo.receivableAmount)
    }
  }, [approveInfo])

  const styles = {
    wrapper: css`
      height: 518px;
      position: relative;
    `,
    header: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: -5px;
    `,
    content: css`
      ${theme.cssMixins.rowHCentered};
      margin-top: 30px;
      font-family: 'Uni-Neue-Regular';
      font-size: 16px;
      line-height: 24px;
      color: #49505b;
    `,
    loader: css`
      width: 100%;
      ${theme.cssMixins.rowHCentered};
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    `,
    okButton: css`
      width: 100%;
      position: absolute;
      bottom: 0;
    `,
  }

  const availableCreditLimit = useMemo(() => {
    if (approveInfo) {
      const principal = creditRecord.unbilledPrincipal
        .add(creditRecord.totalDue)
        .sub(creditRecord.feesAndInterestDue)
        .toNumber()
      return approveInfo.creditLimit - principal
    }
    return 0
  }, [approveInfo, creditRecord])

  const handleChangeAmount = useCallback(
    (newAmount: number) => {
      if (approveInfo) {
        setCurrentAmount(newAmount)
        const newChargedFees = getFeesCharged(newAmount)
        setChargedFees(newChargedFees)
        setRemainder(approveInfo.receivableAmount - newAmount)
      }
    },
    [approveInfo, getFeesCharged],
  )
  const handleAction = useCallback(() => {
    dispatch(
      setIFBorrowAmount({
        requestLoan: currentAmount,
        chargedFees,
        remainder,
      }),
    )
  }, [chargedFees, currentAmount, dispatch, remainder])

  if (alreadyApproved) {
    return (
      <Box css={styles.wrapper}>
        <Typography variant='h6' css={styles.header}>
          Already Factored
        </Typography>
        <Box css={styles.content}>This invoice has already been factored.</Box>
        <Button variant='contained' css={styles.okButton} onClick={handleOk}>
          OKAY
        </Button>
      </Box>
    )
  }

  if (!approveInfo) {
    return null
  }

  return (
    <ChooseAmountModal
      title='Choose Amount'
      description1='Access up to 80% of your invoice value'
      description2='The remainder will be sent to your wallet when the invoice is paid'
      sliderMax={availableCreditLimit}
      currentAmount={currentAmount}
      tokenSymbol={approveInfo.tokenSymbol}
      topLeft='Fees'
      topRight={`${chargedFees} ${approveInfo.tokenSymbol}`}
      downLeft='Remainder'
      downRight={`${remainder} ${approveInfo.tokenSymbol}`}
      handleChangeAmount={handleChangeAmount}
      handleAction={handleAction}
    />
  )
}
