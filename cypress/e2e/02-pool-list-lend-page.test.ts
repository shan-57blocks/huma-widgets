import { valueGreaterThanEqualToZero, valueGreaterThanZero } from '../utils'

describe('Pool List Lend Page', () => {
  beforeEach(() => cy.visit('/#/lend'))

  it('Credit line pool balance and apy should be greater than 0, position should be greater or equal to 0', () => {
    valueGreaterThanZero('#credit-line-pool-balance .pool-info-content')
    valueGreaterThanEqualToZero('#credit-line-pool-position .pool-info-content')

    cy.get('#credit-line-pool-apy .pool-info-content')
      .invoke('text')
      .should((value) => {
        expect(value).equal('10-20%')
      })
  })

  it('Invoice factoring pool balance and apy should be greater than 0, position should be greater or equal to 0', () => {
    valueGreaterThanZero('#invoice-factoring-pool-balance .pool-info-content')
    valueGreaterThanEqualToZero(
      '#invoice-factoring-pool-position .pool-info-content',
    )

    cy.get('#invoice-factoring-pool-apy .pool-info-content')
      .invoke('text')
      .should((value) => {
        expect(value).equal('10-20%')
      })
  })
})
