import React from 'react'
import classnames from 'classnames'
import uuidV4 from 'uuid/v4'
import { Observable } from 'rxjs/Observable'
import { Scheduler } from 'rxjs/Scheduler'

import classes from './style.scss'

const random = (min, max) => min + (Math.random() * (max - min))
const randomDecimals = (min, max) => '0'.repeat(random(min, max))
const getWindowSize = () => ({
  width: window.document.documentElement.clientWidth,
  height: window.document.documentElement.clientHeight,
})
const linearInterpolation = factor => (start, end) => ({
  x: start.x + ((end.x - start.x) * factor),
  y: start.y + ((end.y - start.y) * factor),
})
const amplify = factor => ({ x, y }) => ({
  x: x * factor,
  y: y * factor,
})
const getDifference = ([previous, next]) => ({
  x: next.x - previous.x,
  y: next.y - previous.y,
})

class Background extends React.Component {
  constructor() {
    super()

    this.state = {
      windowSize: {
        width: 0,
        height: 0,
      },
      containerSize: {
        width: 0,
        height: 0,
      },
    }

    this.onResize = this.onResize.bind(this)

    this.circles = {}
  }

  componentDidMount() {
    this.animationFrame$ = Observable.interval(10, Scheduler.animationFrame)
    this.move$ = Observable.merge(
      Observable.fromEvent(window.document, 'mousemove')
        .map(({ clientX, clientY }) => ({ x: clientX, y: clientY }))
        .map(this.offsetMouseOrigin.bind(this)),
      Observable.fromEvent(window, 'deviceorientation')
        .map(({ gamma, beta }) => ({ x: gamma, y: beta }))
        .map(amplify(20))
    )
      .bufferCount(2)
      .map(getDifference)
      .map(({ x, y }) => ({
        x: x > 0 ? Math.min(20, x) : Math.max(-20, x),
        y: y > 0 ? Math.min(20, y) : Math.max(-20, y),
      }))

    this.animationFrameSubscription = this.animationFrame$.subscribe(() => {
      this.forceUpdate()
    })

    window.requestAnimationFrame(() => {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState(
        {
          windowSize: getWindowSize(),
          containerSize: this.getContainerSize(),
        },
        () => {
          for (let i = 1; i <= 20; i += 1) {
            this.spawnCircle()
          }
        }
      )
    })

    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    Object.keys(Object.keys(this.circles)).forEach((uuid) => {
      if (!this.circles[uuid]) {
        return
      }

      this.circles[uuid].subscriptions.forEach((subscription) => {
        subscription.unsubscribe()
      })
    })
    this.animationFrameSubscription.unsubscribe()
  }

  onResize() {
    this.setState({
      windowSize: getWindowSize(),
      containerSize: this.getContainerSize(),
    })
  }

  getContainerSize() {
    const { top, right, bottom, left } = this.container.getBoundingClientRect()
    return {
      width: right - left,
      height: bottom - top,
    }
  }

  offsetMouseOrigin({ x, y }) {
    return {
      x:
        (x - this.state.windowSize.width / 2) /
        this.state.windowSize.width *
        this.state.containerSize.width,
      y:
        (y - this.state.windowSize.height / 2) /
        this.state.windowSize.height *
        this.state.containerSize.width,
    }
  }

  spawnCircle() {
    const circle = this.generateCircle()
    const factor = parseFloat(`0.${randomDecimals(2, 3)}${random(1, 9)}`)

    const floatSubscription = this.animationFrame$.subscribe(() => {
      circle.targetX += 0.3
      circle.targetY -= 0.2
    })
    const moveSubscription = this.move$.subscribe(({ x, y }) => {
      circle.targetX += x
      circle.targetY += y
    })

    const movementSubscription = this.animationFrame$
      .map(() => ({ x: circle.targetX, y: circle.targetY }))
      .scan(linearInterpolation(factor), { x: 0, y: 0 })
      .subscribe(({ x, y }) => {
        this.circles[circle.uuid].translateX = x
        this.circles[circle.uuid].translateY = y
      })

    circle.subscriptions = [floatSubscription, moveSubscription, movementSubscription]

    this.startCircleTtl(circle)

    this.circles[circle.uuid] = circle
  }

  startCircleTtl(circle) {
    Observable.of(null)
      .delay(circle.ttl - 5000)
      .do(() => {
        circle.isDying = true
        this.spawnCircle()
      })
      .delay(5000)
      .subscribe(() => {
        circle.subscriptions.forEach((subscription) => {
          subscription.unsubscribe()
        })
        delete this.circles[circle.uuid]
      })
  }

  generateCircle() {
    const size = random(3, 15)
    return {
      uuid: uuidV4(),
      size,
      top: random(size, this.state.containerSize.height + size),
      left: random(0 - size, this.state.containerSize.width - size),
      ttl: random(15000, 30000),
      translateX: 0,
      translateY: 0,
      targetX: 0,
      targetY: 0,
      subscriptions: [],
    }
  }

  render() {
    return (
      <div
        className={classes.floatingCirclesContainer}
        ref={(el) => {
          this.container = el
        }}
      >
        {Object.keys(this.circles).map(uuid => (
          <div
            key={uuid}
            className={classnames(
              {
                [classes.dying]: this.circles[uuid].isDying,
              },
              classes.circle
            )}
            style={{
              transform: `translateX(${this.circles[uuid].translateX}px) translateY(${this.circles[
                uuid
              ].translateY}px)`,
              top: this.circles[uuid].top,
              left: this.circles[uuid].left,
              width: `${this.circles[uuid].size}vh`,
              height: `${this.circles[uuid].size}vh`,
              backgroundColor: 'rgba(44, 83, 175, 0.5)',
            }}
          />
        ))}
      </div>
    )
  }
}

export default Background
