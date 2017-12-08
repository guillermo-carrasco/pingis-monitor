import React from 'react'
import { connect } from 'react-redux'

import classes from './style.scss'

const mapState = state => ({
  white: state.score.white,
  red: state.score.red,
})

export const ScoreBoardComponent = ({ white, red }) => (
  <div className={classes.container}>
    <div className={classes.cardContainer}>
      <div className={classes.whiteLabel}>
        White player
      </div>
      <div className={classes.card}>
        <div className={classes.border} />
        {white}
      </div>
    </div>

    <div className={classes.cardContainer}>
      <div className={classes.redLabel}>
        Red player
      </div>
      <div className={classes.card}>
        <div className={classes.border} />
        {red}
      </div>
    </div>
  </div>
)

export const ScoreBoard = connect(mapState)(ScoreBoardComponent)
