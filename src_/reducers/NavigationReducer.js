import AppNavigation from '../navigators/AppNavigation'

export default nav = (state, action) => {
  // console.log('In nav reducer', state, action)
  const newState = AppNavigation.router.getStateForAction(action, state)
  return newState || state
}
