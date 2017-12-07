import Immutable from 'seamless-immutable'
import { combineEpics } from 'redux-observable'
import { socket$ } from '../../utils/ws'
import store from '../store'

const TABLE_STATUS_CHANGE = 'status/TABLE_STATUS_CHANGE'

const tableStatusChange = payload => ({
  type: TABLE_STATUS_CHANGE,
  payload,
})

const initialState = Immutable.from({
  status: 'Free',
})

export default (state = initialState, action) => {
  switch (action.type) {
    case TABLE_STATUS_CHANGE:
      return state.set('status', action.payload)

    default:
      return state
  }
}

export const tableStatusSubscription = socket$
  .filter(action => action.event === 'TableStatus')
  .subscribe((event) => {
    store.dispatch(tableStatusChange(event.data))
  })

export const statusEpic = combineEpics()
