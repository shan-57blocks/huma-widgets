import {
  Box,
  Button,
  css,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'ethers'
import { useFormik } from 'formik'
import { useAtom } from 'jotai'
import { useResetAtom } from 'jotai/utils'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'

import { Loading } from '../../../../components/Loading'
import { sendTxAtom, txAtom } from '../../../../hooks/useContractFunction'
import { useInvoiceNFTContract } from '../../../../hooks/useInvoiceNFTContract'
import { POOL_NAME } from '../../../../utils/pool'
import { getUnixTimestamp } from '../../../../utils/time'
import { TxStateType } from '../../../../utils/transaction'

type Props = {
  handleSuccess: () => void
}

export function MintNFT({ handleSuccess }: Props): React.ReactElement {
  const { account, provider } = useWeb3React()
  const [checked, setChecked] = useState(false)
  const invoiceNFTContract = useInvoiceNFTContract(POOL_NAME.RequestNetwork)
  const [{ loading: txLoading, state: txState }, send] = useAtom(sendTxAtom)
  const reset = useResetAtom(txAtom)

  useEffect(() => {
    if (txState === TxStateType.Success) {
      handleSuccess()
      reset()
    }
  }, [handleSuccess, reset, txState])

  const styles = {
    formWrapper: css`
      width: 200px;
    `,
    switch: css`
      margin-bottom: 10px;
    `,
    formItem: css`
      margin-bottom: 20px;
    `,
    resize: css`
      font-size: 16px;
    `,
  }

  const generateUri = (amount: number, dueDate: moment.Moment) => {
    const uriDict = {
      description: 'Invoice NFT',
      name: `Invoice ${account}`,
      image:
        'https://ipfs.io/ipfs/Qmf23jkGtxXwi4u4MiMmnKLA98rkGXnF19nWfLD1S7GXJt',
      attributes: {
        payee: account,
        payer: '0xBe477fb44C3c7De4876631C0dEe6a88a4Fd4089e',
        currency: 'USDC',
        amount,
        status: 'Requested',
        creationDate: getUnixTimestamp(),
        dueDate: getUnixTimestamp(dueDate),
      },
    }

    const result = {
      description: uriDict.description,
      name: uriDict.name,
      image: uriDict.image,
      attributes: [],
    }

    Object.keys(uriDict.attributes).forEach((attributeKey) => {
      // @ts-ignore
      const value = uriDict.attributes[attributeKey]
      const item = {
        trait_type: attributeKey,
        value,
      }
      if (attributeKey === 'creationDate' || attributeKey === 'dueDate') {
        // @ts-ignore
        item.display_type = 'date'
      }
      // @ts-ignore
      result.attributes.push(item)
    })

    const encoded = btoa(JSON.stringify(result))

    return `data:application/json;base64,${encoded}`
  }

  const formik = useFormik({
    initialValues: {
      amount: 0,
      invoiceDueDate: moment(new Date()),
    },
    validationSchema: yup.object({
      amount: yup
        .number()
        .typeError('Amount must be a number')
        .required('Invoice amount is required')
        .moreThan(0, 'Amount should be positive'),
    }),
    onSubmit: (values) => {
      const tokenURI = generateUri(values.amount, values.invoiceDueDate)
      send({
        contract: invoiceNFTContract as Contract,
        method: 'mintNFT',
        params: [account, tokenURI],
        provider,
      })
    },
  })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  return (
    <Box>
      <FormControlLabel
        css={styles.switch}
        control={<Switch checked={checked} onChange={onChange} />}
        label={<Typography variant='body2'>Mint NFT</Typography>}
      />

      {checked && (
        <Box css={styles.formWrapper}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              css={styles.formItem}
              fullWidth
              id='amount'
              name='amount'
              size='small'
              label={
                <Typography variant='body2Small'>
                  Invoice Amount (USDC)
                </Typography>
              }
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              inputProps={{ style: { fontSize: 20, marginTop: 10 } }}
            />
            <DesktopDatePicker
              disablePast
              css={styles.formItem}
              label={<Typography variant='body2'>Invoice Due Date</Typography>}
              inputFormat='MM/DD/YYYY'
              value={formik.values.invoiceDueDate}
              onChange={(newValue) => {
                formik.setFieldValue('invoiceDueDate', newValue)
              }}
              renderInput={(params) => {
                if (!params.inputProps!.style) {
                  params.inputProps!.style = {
                    fontSize: 20,
                    padding: '12px 14px',
                  }
                }
                return <TextField id='invoiceDueDate' {...params} />
              }}
            />
            {!txLoading && (
              <Button
                color='primary'
                variant='contained'
                fullWidth
                type='submit'
              >
                Mint NFT
              </Button>
            )}
            {txLoading && (
              <Button color='primary' variant='contained' fullWidth disabled>
                <Loading size={20} />
                <Box component='span' sx={{ marginLeft: '10px' }}>
                  Minting NFT
                </Box>
              </Button>
            )}
          </form>
        </Box>
      )}
    </Box>
  )
}
