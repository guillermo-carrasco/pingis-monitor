import React from 'react'
import { Status } from '../Status/index';
import { ScoreBoard } from '../ScoreBoard/index';

export class PingPongStatus extends React.Component {
  render() {
    return (
      <div>
        <Status />
        <ScoreBoard />
      </div>
    )
  }
}
