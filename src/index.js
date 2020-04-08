import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import DndBackend from 'react-dnd-html5-backend'
import './index.css'

import App from './App'
import buildStore from './store/store'
import rootReducer from './reducers/rootReducer'
import { syncToLocalStore, getStateFromLocalStore } from './store/localStore'

const store = buildStore({
	rootReducer,
	preloadedState: getStateFromLocalStore(window.localStorage, 'todo list'),
})
store.subscribe(syncToLocalStore(window.localStorage, 'todo list', store))

ReactDOM.render(
	<DndProvider backend={DndBackend}>
		<Provider store={store}>
			<App />
		</Provider>
	</DndProvider>,
	document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
