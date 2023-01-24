import {SolSelect} from '../../../Select';
import {TestID} from '../../../testID';
import {Get} from '../../../utils';
import {Option} from '../Option';
import {fireEvent, render} from 'solid-testing-library';

const GetOption = () => Get(TestID.OPTION) as HTMLButtonElement;

describe('Option', function () {
  test('should be render', () => {
    render(() => (
      <SolSelect show>
        <Option value="some value" />
      </SolSelect>
    ));

    expect(GetOption()).toBeInTheDocument();
  });
  test('should set value', () => {
    const value = 'value';
    render(() => (
      <SolSelect show>
        <Option value={value} />
      </SolSelect>
    ));

    expect(GetOption()).toHaveValue(value);
  });
  test('should show value as children', () => {
    const value = 'value';
    render(() => (
      <SolSelect show>
        <Option value={value} />
      </SolSelect>
    ));

    expect(GetOption()).toHaveTextContent(value);
  });
  test('should show children, not value', () => {
    const value = 'value';
    const children = 'children';

    render(() => (
      <SolSelect show>
        <Option value={value}>{children}</Option>
      </SolSelect>
    ));

    expect(GetOption()).toHaveValue(value);
    expect(GetOption()).toHaveTextContent(children);
  });
  test('should be disabled', () => {
    render(() => (
      <SolSelect show>
        <Option value={'value'} disabled />
      </SolSelect>
    ));

    expect(GetOption()).toBeDisabled();
  });
  test('should be disabled if empty', () => {
    render(() => (
      <SolSelect show>
        <Option value={'value'} empty />
      </SolSelect>
    ));

    expect(GetOption()).toBeDisabled();
  });
  test('should has empty class', () => {
    render(() => (
      <SolSelect show>
        <Option value={'value'} empty />
      </SolSelect>
    ));

    expect(GetOption()).toHaveClass('empty');
  });
  test('should set custom class', () => {
    const className = 'class-name';
    render(() => (
      <SolSelect show>
        <Option value={'value'} class={className} />
      </SolSelect>
    ));

    expect(GetOption()).toHaveClass(className);
  });
  test('should set classList', () => {
    const className = 'class-name';
    const classList = {[className]: true};
    render(() => (
      <SolSelect show>
        <Option value={'value'} classList={classList} />
      </SolSelect>
    ));

    expect(GetOption()).toHaveClass(className);
  });
  test('should be type = button', () => {
    render(() => (
      <SolSelect show>
        <Option value={'value'} />
      </SolSelect>
    ));

    expect(GetOption()).toHaveAttribute('type', 'button');
  });
  test('should emit onClick', () => {
    const onClick = jest.fn();

    render(() => (
      <SolSelect show>
        <Option value={'value'} onClick={onClick} />
      </SolSelect>
    ));

    fireEvent.click(GetOption());
    expect(onClick).toBeCalled();
  });
  test('should show subtext', () => {
    const subtext = 'sub-text';
    render(() => (
      <SolSelect show>
        <Option value={'value'} subtext={subtext} />
      </SolSelect>
    ));

    expect(Get(TestID.OPTION_SUBTEXT)).toBeInTheDocument();
    expect(Get(TestID.OPTION_SUBTEXT)).toHaveTextContent(subtext);
  });
});
