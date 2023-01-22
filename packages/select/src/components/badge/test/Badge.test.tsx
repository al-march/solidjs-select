import {TestID} from '../../../testID';
import {Get} from '../../../utils';
import {Badge} from '../Badge';
import {fireEvent, render} from 'solid-testing-library';

const GetBadge = () => Get(TestID.BADGE);
const GetBadgeAction = () => Get(TestID.BADGE_ACTION);

describe('Badge', function () {
  test('should be render', () => {
    render(() => <Badge />);
    expect(GetBadge()).toBeInTheDocument();
  });
  test('should set class', () => {
    const className = 'class-name';
    render(() => <Badge class={className} />);
    expect(GetBadge()).toHaveClass(className);
  });
  test('should set classList', () => {
    const className = 'class-name';
    render(() => <Badge classList={{[className]: true}} />);
    expect(GetBadge()).toHaveClass(className);
  });
  test('should emit onRemove', () => {
    const onRemove = jest.fn();
    render(() => <Badge hasAction onRemove={onRemove} />);
    fireEvent.click(GetBadgeAction());
    expect(onRemove).toBeCalled();
  });
  test('should emit onClick', () => {
    const onClick = jest.fn();
    render(() => <Badge onClick={onClick} />);
    fireEvent.click(GetBadge());
    expect(onClick).toBeCalled();
  });
  test('should set children', () => {
    const content = 'badge content';
    render(() => <Badge>{content}</Badge>);
    expect(GetBadge()).toHaveTextContent(content);
  });
  test('should has the action area', () => {
    render(() => <Badge hasAction />);
    expect(GetBadgeAction()).toBeInTheDocument();
  });
  test('should has not the action area', () => {
    render(() => <Badge hasAction={false} />);
    try {
      // Should be error
      GetBadgeAction();
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });
});
