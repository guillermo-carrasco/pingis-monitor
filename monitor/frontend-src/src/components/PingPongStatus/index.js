import React from 'react'
import { Status } from '../Status/index'
import { ScoreBoard } from '../ScoreBoard/index'

import Background from './components/Background'

import classes from './style.scss'

export class PingPongStatus extends React.Component {
  render() {
    return (
      <div className={classes.container}>
        <Background />
        <Status />
        <ScoreBoard />
      </div>
    )
  }
}
