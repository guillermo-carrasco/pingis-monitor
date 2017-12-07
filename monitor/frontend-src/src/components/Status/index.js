import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import classes from './style.scss'

import tickIcon from './tick.svg'
import crossIcon from './cross.svg'

const mapState = state => ({
  status: state.status.status,
})

const isFree = status => status.toLowerCase() === 'free'

export const StatusComponent = ({ status }) => (
  <div className={classes.container}>
    <div
      className={classnames({
        [classes.freeIcon]: isFree(status),
        [classes.busyIcon]: !isFree(status),
      }, classes.icon)}
      dangerouslySetInnerHTML={{ __html: isFree(status) ? tickIcon : crossIcon }}
    />
    <div
      className={classnames({
        [classes.freeText]: isFree(status),
        [classes.busyText]: !isFree(status),
      }, classes.text)}
    >
      {status}
    </div>
  </div>
)

export const Status = connect(mapState)(StatusComponent)
