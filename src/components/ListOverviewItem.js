import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import * as R from 'ramda'

import { DragItemType, moveTodoToList, reorderTodoList } from '../actions/dndActions'

const ListOverviewItemView = ({id, name, dragRef, isSelected, onSelect}) => {
	return <li
		className={isSelected ? 'active' : ''}
		ref={dragRef}
		onClick={() => onSelect(id, name)}
	>{name}</li>
}

const ListOverviewItem = ({id, name, isSelected, onSelect}) => {
	const dispatch = useDispatch()
	const dispatchMoveItemToList = R.compose(dispatch, moveTodoToList)
	const dispatchReorderTodoList = R.compose(dispatch, reorderTodoList)
	const dragRef = useRef()
	const [{isDragging}, drag] = useDrag({
		item: {
			type: DragItemType.todoList,
			id,
			name,
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})
	const [, drop] = useDrop({
		accept: [DragItemType.todoItem, DragItemType.todoList],
		drop: R.when(item => item.type === DragItemType.todoItem,
			item => dispatchMoveItemToList(item, {id, name})),
		hover: R.when(list => list.type === DragItemType.todoList && !isDragging,
			list => dispatchReorderTodoList(list, {id, name})),
	})
	drag(drop(dragRef))
	return <ListOverviewItemView id={id} name={name}
		dragRef={dragRef}
		isSelected={isSelected}
		onSelect={onSelect}
	/>
}

export default ListOverviewItem
