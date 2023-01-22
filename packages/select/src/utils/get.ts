import {TestID} from '../testID';
import {screen} from 'solid-testing-library';

export const Get = (selector: TestID) => screen.getByTestId(selector);
