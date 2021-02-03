// Libraries
import React from 'react'
import {screen} from '@testing-library/react'
import {renderWithReduxAndRouter} from 'src/mockState'

// Components
import {Settings} from 'src/me/components/account/Settings'
import {me} from '../../mockUserData'

const setup = (override?) => {
  const props = {
    me,
    ...override,
  }

  renderWithReduxAndRouter(<Settings {...props} />)
}

describe('Account', () => {
  describe('rendering', () => {
    it('displays the users info by default', async () => {
      setup()
      const elm = await screen.getByTestId('nameInput')
      expect(elm.getAttribute('value')).toBe(me.name)
    })
  })
})
