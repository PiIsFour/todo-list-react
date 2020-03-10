import * as R from 'ramda'
import { keepRefIfEqual, keepRefIfNoChange, adjustOnCondition, adjustObjectProp, combineReducers } from './util'

describe('reducer util', () => {
	it('keepRefIfEqual retruns defaultValue if piped value is equal', () => {
		const defaultValue = {a: 5}
		const fn = keepRefIfEqual(defaultValue)
		expect(fn({a: 5})).toBe(defaultValue)
	})

	it('keepRefIfEqual retruns value if piped value is not equal', () => {
		const defaultValue = {a: 5}
		const fn = keepRefIfEqual(defaultValue)
		expect(fn({a: 3})).toEqual({a: 3})
	})

	it('keepRefIfNoChange updates with fn', () => {
		const input = {c: 3}
		const output = {x: 5}
		const updater = jest.fn().mockReturnValue(output)
		expect(keepRefIfNoChange(updater)(input)).toBe(output)
		expect(updater).toHaveBeenCalledWith(input)
	})

	it('keepRefIfNoChange returns same ref if no change', () => {
		const input = {c: 3}
		const output = R.clone(input)
		const updater = jest.fn().mockReturnValue(output)
		expect(keepRefIfNoChange(updater)(input)).toBe(input)
		expect(keepRefIfNoChange(updater)(input)).not.toBe(output)
	})

	it('adjustOnCondition adjusts array members that meet the condition', () => {
		const array = [1, 5, 9, 12]
		expect(adjustOnCondition(
			x => x >= 5 && x <= 10,
			x => x + 1,
		)(array)).toEqual([1, 6, 10, 12])
	})

	it('adjustObjectProp adjusts a object prop', () => {
		const testObject = {
			a: 5,
			c: 7,
		}
		expect(adjustObjectProp('c', x => x * 2)(testObject)).toEqual({
			a: 5,
			c: 14,
		})
	})

	it('combineReducers calles the child reducers with the whole state', () => {
		const reducerA = jest.fn().mockReturnValue('new a')
		const reducerB = jest.fn().mockReturnValue('new b')
		const state = {
			a: 'old a',
			b: 'old b',
		}
		const action = { type: 'TEST-ACTION' }
		const rootReducer = combineReducers({
			a: reducerA,
			b: reducerB,
		})
		expect(rootReducer(state, action)).toEqual({
			a: 'new a',
			b: 'new b',
		})
		expect(reducerA).toHaveBeenCalledWith(state, action)
		expect(reducerB).toHaveBeenCalledWith(state, action)
	})

	it('combineReducers returns same state if nothing changes', () => {
		const reducerA = jest.fn(x => x.a)
		const reducerB = jest.fn(x => x.b)
		const state = {
			a: 'old a',
			b: 'old b',
		}
		const action = { type: 'TEST-ACTION' }
		const rootReducer = combineReducers({
			a: reducerA,
			b: reducerB,
		})
		expect(rootReducer(state, action)).toBe(state)
	})
})
