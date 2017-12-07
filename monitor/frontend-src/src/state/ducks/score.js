import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'
import { socket$ } from '../../utils/ws'
import store from '../store'

const WHITE_CHANGE = 'score/WHITE_COUNTER_CHANGE'
const RED_CHANGE = 'score/RED_COUNTER_CHANGE'

export const whiteChange = payload => ({
  type: WHITE_CHANGE,
  payload,
})

export const redChange = payload => ({
  type: RED_CHANGE,
  payload,
})

const initialState = Immutable.from({
  white: 0,
  red: 0,
})

export default (state = initialState, action) => {
  switch (action.type) {
    case WHITE_CHANGE:
      return state.set('white', action.payload)

    case RED_CHANGE:
      return state.set('red', action.payload)

    default:
      return state
  }
}

export const whiteScoreChangeSubscription = socket$
  .filter(action => action.event === 'WhiteCounter')
  .subscribe((event) => {
    store.dispatch(whiteChange(event.data))
  })
export const redScoreChangeSubscription = socket$
  .filter(action => action.event === 'RedCounter')
  .subscribe((event) => {
    store.dispatch(redChange(event.data))
  })

export const scoreEpic = combineEpics()
