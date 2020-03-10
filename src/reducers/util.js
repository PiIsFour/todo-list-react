import * as R from 'ramda'

export const keepRefIfEqual = defaultValue => value =>
	R.equals(value, defaultValue) ? defaultValue : value

export const keepRefIfNoChange = fn => x => R.pipe(fn, keepRefIfEqual(x))(x)

export const adjustOnCondition = (condition, updater) => keepRefIfNoChange(
	R.map(x => {
		if(condition(x)){
			return updater(x)
		}
		return x
	}),
)

export const adjustObjectProp = (key, updater) => keepRefIfNoChange(object => ({
	...object,
	[key]: updater(object[key]),
}))

export const combineReducers = (reducers) => (state, action) => {
	return R.pipe(
		R.map(reducer => reducer(state, action)),
		keepRefIfEqual(state),
	)(reducers)
}
