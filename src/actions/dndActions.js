import ActionType from './type'

export const DragItemType = Object.freeze({
	todoItem: 'TODO_ITEM',
})

export const reorderTodo = (item, to) => ({
	type: ActionType.reorderTodo,
	item,
	to,
})
