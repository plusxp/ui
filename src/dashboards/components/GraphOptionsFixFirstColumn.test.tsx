import React from 'react'
import {screen} from '@testing-library/react'

import {renderWithReduxAndRouter} from 'src/mockState'

import GraphOptionsFixFirstColumn from 'src/dashboards/components/GraphOptionsFixFirstColumn'

const setup = (override = {}) => {
  const props = {
    fixed: true,
    onToggleFixFirstColumn: () => {},
    ...override,
  }

  renderWithReduxAndRouter(<GraphOptionsFixFirstColumn {...props} />)
}

describe('Dashboards.Components.GraphOptionsFixFirstColumn', () => {
  describe('rendering', () => {
    it('shows checkbox and label', async () => {
      setup()
      const elm = await screen.findByTestId('graph-options-first-column')
      const checkbox = await screen.findByTestId('fix-first-column-checkbox')

      expect(elm).toBeVisible()
      expect(checkbox).toBeVisible()
      expect(checkbox.getAttribute('type')).toEqual('checkbox')
    })

    describe('if fixed is true', () => {
      it('input is checked', async () => {
        setup()
        const checkbox = await screen.findByTestId('fix-first-column-checkbox')

        expect(checkbox.getAttribute('checked')).toBe('')
      })
    })

    describe('if fixed is false', () => {
      it('input is not checked', async () => {
        setup({fixed: false})
        const checkbox = await screen.findByTestId('fix-first-column-checkbox')

        expect(checkbox.getAttribute('checked')).toBe(null)
      })
    })
  })
})
