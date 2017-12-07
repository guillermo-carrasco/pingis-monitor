import React from 'react'
import { shallow } from 'enzyme'

import ItWorks from './index'

describe('components', () => {
  describe('ItWorks', () => {
    it('renders without exploding', () => {
      shallow(<ItWorks />)
    })
  })
})
