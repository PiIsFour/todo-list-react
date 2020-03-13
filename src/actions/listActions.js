import { uuid } from 'uuidv4'
import actionType from './type'

export const addListWithId = (name, id) => ({
	type: actionType.addList,
	name,
	id,
})

export const addListFactory = uuid => name => addListWithId(name, uuid())

export const addList = addListFactory(uuid)

export const selectList = (id, name) => ({
	type: actionType.selectList,
	id,
	name,
})

export const deleteList = (id, name) => ({
	type: actionType.deleteList,
	id,
	name,
})

export const addAndSelectList = name => dispatch => {
	const addAction = addList(name)
	dispatch(addAction)
	dispatch(selectList(addAction.id, name))
}
