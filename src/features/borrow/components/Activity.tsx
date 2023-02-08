import { Box, css } from '@mui/material'
import { useQuery, gql } from '@apollo/client'

import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { PoolInfoType } from '../../../utils/pool'
import { CreditEvent, CreditEventText } from '../../../utils/credit'
import { downScale } from '../../../utils/number'
import timeUtil from '../../../utils/time'
import { HumaTable } from '../../../components/HumaTable'
import { useMQ } from '../../../hooks/useMQ'

const GET_ACTIVITY = gql`
  query GetCreditLineActivity($pool: String!, $owner: String!, $event: [Int]!) {
    creditEvents(
      where: { pool: $pool, owner: $owner, event_in: $event }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      timestamp
      owner
      pool
      event
    }
  }
`

type Props = {
  poolInfo: PoolInfoType
  targetEvents: CreditEvent[]
}

type ActivityDataType = {
  id: string
  owner: string
  pool: string
  timestamp: string
  amount: string
  event: number
  eventText: string | undefined
}

const columns = [
  { title: 'Action', dataIndex: 'eventText', noSeparator: true },
  { title: 'Amount', dataIndex: 'amount' },
  { title: 'Date', dataIndex: 'timestamp' },
]

export function Activity({
  poolInfo,
  targetEvents,
}: Props): React.ReactElement | null {
  const { account } = useWeb3React()
  const { decimals } = poolInfo.poolUnderlyingToken
  const [events, setEvents] = useState<ActivityDataType[] | undefined>()
  const { data } = useQuery<{
    creditEvents: ActivityDataType[]
  }>(GET_ACTIVITY, {
    variables: {
      pool: poolInfo.pool,
      owner: account,
      event: targetEvents,
    },
  })
  const { isSmSize } = useMQ()

  const getPadding = () => {
    if (isSmSize) {
      return '16px 24px'
    }
    return '33px 48px'
  }

  useEffect(() => {
    if (!data?.creditEvents) {
      return
    }
    const result = data.creditEvents.map((item) => {
      const event = JSON.parse(JSON.stringify(item)) as ActivityDataType
      event.eventText = CreditEventText[item.event]
      event.amount = downScale(event.amount, decimals)
      event.timestamp = timeUtil.timestampToLL(Number(event.timestamp))
      return event
    })
    setEvents(result)
  }, [data?.creditEvents, decimals])

  const styles = {
    wrapper: css`
      margin-top: 71px;
    `,
    title: css`
      font-family: 'Uni-Neue-Black';
      font-size: 24px;
      color: #6b6572;
      margin-bottom: 14px;
    `,
    tableWrapper: css`
      background: #ffffff;
      box-shadow: 0px 4px 40px 8px rgba(0, 0, 0, 0.04);
      border-radius: 24px;
      padding: ${getPadding()};
    `,
  }

  if (!events) {
    return null
  }

  return (
    <Box css={styles.wrapper}>
      <Box css={styles.title}>Recent Activity</Box>
      <Box css={styles.tableWrapper}>
        <HumaTable columns={columns} rows={events} hideRowsPerPage={isSmSize} />
      </Box>
    </Box>
  )
}
