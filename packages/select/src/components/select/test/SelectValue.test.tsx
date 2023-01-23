import {TestID} from '../../../testID';
import {Get, GetAll} from '../../../utils';
import {SelectValue} from '../SelectValue';
import {fireEvent, getByTestId, render} from 'solid-testing-library';

const GetSelectValue = () => Get(TestID.SELECT_VALUE);
const GetBadges = () => GetAll(TestID.BADGE);

describe('SelectValue', function () {
  test('should be rendered', () => {
    render(() => <SelectValue values={[]} />);
    expect(GetSelectValue()).toBeInTheDocument();
  });
  test('should render value', () => {
    const value = 'select-value';
    render(() => <SelectValue values={[value]} />);
    expect(GetSelectValue()).toHaveTextContent(value);
  });
  test('should render multiple values', () => {
    const values = ['value-1', 'value-2'];
    render(() => <SelectValue values={values} multiple />);
    const badges = GetBadges();
    expect(badges).toHaveLength(values.length);

    values.forEach((value, i) => {
      expect(badges[i]).toHaveTextContent(value);
    });
  });
  test('should render the first value in single mode', () => {
    const values = ['value-1', 'value-2'];
    render(() => <SelectValue values={values} />);
    expect(GetSelectValue()).toHaveTextContent(values[0]);
    expect(GetSelectValue()).not.toHaveTextContent(values[1]);
  });
  test('should emit onRemove', () => {
    const onRemove = jest.fn();
    const values = ['value-1'];
    render(() => <SelectValue values={values} multiple onRemove={onRemove} />);
    const [badge] = GetBadges();
    fireEvent.click(getByTestId(badge, TestID.BADGE_ACTION));

    expect(onRemove).toBeCalled();
    expect(onRemove).lastCalledWith(values[0]);
  });
});
