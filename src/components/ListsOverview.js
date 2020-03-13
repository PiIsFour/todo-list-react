import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import * as R from 'ramda'
import './ListsOverview.css'

import AddInput from './AddInput'
import { addAndSelectList, selectList } from '../actions/listActions'

export const ListsOverviewView = ({todoLists, selectedListId, dispatch}) => {
	const dispatchAddList = name => dispatch(addAndSelectList(name))
	const dispatchSelectList = (id, name) => dispatch(selectList(id, name))
	const renderListItem = ({name, id}) => <li
		className={id === selectedListId ? 'active' : ''}
		key={id}
		onClick={() => dispatchSelectList(id, name)}
	>{name}</li>
	return <div className="lists-overview">
		<h2>My lists</h2>
		<ul>
			{todoLists.map(renderListItem)}
		</ul>
		<AddInput lable="new list name" onAdd={dispatchAddList} />
	</div>
}

ListsOverviewView.propTypes = {
	todoLists: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})).isRequired,
	selectedListId: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

export const getTodoLists = R.prop('todoLists')

export const getSelectedListId = ({selectedList}) => selectedList.id

const ListsOverview = () => {
	const todoLists = useSelector(getTodoLists)
	const selectedListId = useSelector(getSelectedListId)
	const dispatch = useDispatch()
	return <ListsOverviewView todoLists={todoLists} selectedListId={selectedListId} dispatch={dispatch} />
}

export default ListsOverview
