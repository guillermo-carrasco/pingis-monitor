import React from 'react'
import { connect } from 'react-redux'

const mapState = state => ({
  white: state.score.white,
  red: state.score.red,
})

export const ScoreBoardComponent = ({ white, red }) => (
  <div>{white} - {red}</div>
)

export const ScoreBoard = connect(mapState)(ScoreBoardComponent)
