import { combineReducers } from 'redux'
import status from './ducks/status'
import score from './ducks/score'

const rootReducer = combineReducers({ status, score })

export default rootReducer
