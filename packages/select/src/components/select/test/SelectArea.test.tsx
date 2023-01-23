import {TestID} from '../../../testID';
import {Get} from '../../../utils';
import {SelectArea} from '../SelectArea';
import {render} from 'solid-testing-library';

const GetSelectArea = () => Get(TestID.SELECT_AREA);

describe('SelectArea', function () {
  test('should be rendered', () => {
    render(() => <SelectArea />);
    expect(GetSelectArea()).toBeInTheDocument();
  });
  test('should set focused class', () => {
    render(() => <SelectArea focused />);
    expect(GetSelectArea()).toHaveClass('focused');
  });
  test('should set disabled class', () => {
    render(() => <SelectArea disabled />);
    expect(GetSelectArea()).toHaveClass('disabled');
  });
  test('should set custom class', () => {
    const className = 'class-name';
    render(() => <SelectArea class={className} />);
    expect(GetSelectArea()).toHaveClass(className);
  });
  test('should set classList', () => {
    const className = 'class-name';
    render(() => <SelectArea classList={{[className]: true}} />);
    expect(GetSelectArea()).toHaveClass(className);
  });
});
