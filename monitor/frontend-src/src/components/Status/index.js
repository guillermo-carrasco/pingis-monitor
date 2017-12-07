import React from 'react'
import { connect } from 'react-redux'

const mapState = state => ({
  status: state.status.status,
})

export const StatusComponent = ({ status }) => (
  <div>
    status: {status}
  </div>
)

export const Status = connect(mapState)(StatusComponent)
