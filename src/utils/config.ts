import { CHAINS } from './chain'

const EABaseUrl = process.env.REACT_APP_EA_BASE_URL
const EAAllowListUrl = process.env.REACT_APP_EA_ALLOW_LIST_URL
const getEABaseUrlV1 = (chainId: number) => {
  const network = CHAINS[chainId].name
  return `https://${network}.risk.huma.finance`
}
const getRNBaseUrl = (chainId: number) => {
  const network = CHAINS[chainId].name
  return `https://${network}.api.huma.finance`
}
const InfuraRpcUrl = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`
const AlchemyRpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`

const configUtil = {
  EABaseUrl,
  EAAllowListUrl,
  getEABaseUrlV1,
  getRNBaseUrl,
  InfuraRpcUrl,
  AlchemyRpcUrl,
}

export default configUtil
