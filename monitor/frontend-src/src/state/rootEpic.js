import { combineEpics } from 'redux-observable'
import { statusEpic } from './ducks/status'
import { scoreEpic } from './ducks/score'

export default combineEpics(statusEpic, scoreEpic)
