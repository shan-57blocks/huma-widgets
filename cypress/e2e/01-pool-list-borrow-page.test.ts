import { valueGreaterThanZero } from '../utils'

describe('Pool List Borrow Page', () => {
  beforeEach(() => cy.visit('/#/borrow'))

  it('Credit line pool liquidity should be greater than 0', () => {
    valueGreaterThanZero('#credit-line-pool-borrow .pool-info-content')
  })

  it('Invoice factoring pool liquidity should be greater than 0', () => {
    valueGreaterThanZero('#invoice-factoring-pool-borrow .pool-info-content')
  })
})
