import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useWeb3React } from '@web3-react/core'

import { PoolContractMap } from '../utils/pool'
import { WCProps } from '../utilTypes'

export function ApolloWrapper({
  children,
}: WCProps): React.ReactElement | null {
  const { chainId } = useWeb3React()

  if (!chainId) {
    return null
  }

  const client = new ApolloClient({
    uri: PoolContractMap[chainId]?.subgraph,
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
