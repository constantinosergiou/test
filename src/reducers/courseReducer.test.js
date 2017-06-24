import expect from 'expect';
import courseReducer from './courseReducer';
import * as actions from '../actions/courseActions';

describe('Course Reducer', () => {
	it('should add course when passed CREATE_COURSE_SUCCESS', () =>{
		//arrange
		const initialState = [
				{title: 'A'},
				{title: 'B'}
		];
			const newCourse = {title: 'C'};
			const action = actions.createCourseSuccess(newCourse);
			const newState = courseReducer(initialState, action);
			expect(newState.length).toEqual(3);
			expect(newState[0].title).toEqual('A');
			expect(newState[1].title).toEqual('B');
			expect(newState[2].title).toEqual('C');
});
});
