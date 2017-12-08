import React from 'react'
import { connect } from 'react-redux'
import leftpad from 'left-pad'

import classes from './style.scss'

const mapState = state => ({
  date: state.status.busySince,
})

const getTime = date => new Date() - new Date(date)
const getMinutes = time => Math.floor(time / 60000)
const getSeconds = time => Math.floor(time / 1000) - (getMinutes(time) * 60)
const getMillis = time => (
  Math.floor(time / 10)
  - (getMinutes(time) * 6000)
  - (getSeconds(time) * 100)
)

class Timer extends React.Component {
  componentDidMount() {
    this.timer = window.setInterval(() => {
      this.forceUpdate()
    }, 42)
  }

  componentWillUnmount() {
    window.clearInterval(this.timer)
  }

  render() {
    if (!this.props.date) {
      return null
    }

    return (
      <div className={classes.timer}>
        {leftpad(getMinutes(getTime(this.props.date)), 2, '0')}
        :{leftpad(getSeconds(getTime(this.props.date)), 2, '0')}
        .{leftpad(getMillis(getTime(this.props.date)), 2, '0')}
      </div>
    )
  }
}

export default connect(mapState)(Timer)
