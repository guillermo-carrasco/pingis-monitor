import React from 'react'
import { Status } from '../Status/index'
import { ScoreBoard } from '../ScoreBoard/index'
import Timer from '../Timer'

import Background from './components/Background'

import classes from './style.scss'

import pingPongIcon from './ping-pong.svg'

export class PingPongStatus extends React.Component {
  render() {
    return (
      <div className={classes.container}>
      <Background />
        <h1 className={classes.headline}>
          The ping pong table
          <div className={classes.icon} dangerouslySetInnerHTML={{ __html: pingPongIcon }} />
        </h1>
        <Status />
        <Timer />
        <ScoreBoard />
      </div>
    )
  }
}
