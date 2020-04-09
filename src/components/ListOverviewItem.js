import React from 'react'
import { useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import * as R from 'ramda'

import { DragItemType, moveTodoToList } from '../actions/dndActions'

const ListOverviewItemView = ({id, name, dropRef, isSelected, onSelect}) => {
	return <li
		className={isSelected ? 'active' : ''}
		ref={dropRef}
		onClick={() => onSelect(id, name)}
	>{name}</li>
}

const ListOverviewItem = ({id, name, isSelected, onSelect}) => {
	const dispatch = useDispatch()
	const dispatchMoveItemToList = R.compose(dispatch, moveTodoToList)
	const [, drop] = useDrop({
		accept: DragItemType.todoItem,
		drop: (item) => dispatchMoveItemToList(item, {id, name}),
	})
	return <ListOverviewItemView id={id} name={name}
		dropRef={drop}
		isSelected={isSelected}
		onSelect={onSelect}
	/>
}

export default ListOverviewItem
