import {SolSelectCtx, SolSelectState} from '../../../Select';
import {TestID} from '../../../testID';
import {Get, GetAll, tick} from '../../../utils';
import {Option} from '../../option';
import {Dropdown} from '../Dropdown';
import {createSignal, For, ParentProps} from 'solid-js';
import {createStore} from 'solid-js/store';
import {render} from 'solid-testing-library';

const SelectFakeCtx = (props: ParentProps) => {
  const [state] = createStore<SolSelectState>({
    value: new Set(),
    focused: false,
    disabled: false,
    search: '',

    get opened() {
      return this.focused;
    },
    get closed() {
      return !this.opened;
    },
  });

  function select() {}
  function reset() {}

  return (
    <SolSelectCtx.Provider
      value={{
        state,
        select,
        reset,
      }}
    >
      {props.children}
    </SolSelectCtx.Provider>
  );
};

export const GetDropdown = () => Get(TestID.DROPDOWN);

const [v] = createSignal();

describe('Dropdown', function () {
  test('should render', () => {
    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show />
      </SelectFakeCtx>
    ));
    expect(GetDropdown()).toBeInTheDocument();
  });
  test('should set classes', () => {
    const className = 'class-name';
    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show class={className} />
      </SelectFakeCtx>
    ));
    expect(GetDropdown()).toHaveClass(className);
  });
  test('should set classList', () => {
    const className = 'class-name';
    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show classList={{[className]: true}} />
      </SelectFakeCtx>
    ));
    expect(GetDropdown()).toHaveClass(className);
  });
  test('should show empty option', () => {
    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show />
      </SelectFakeCtx>
    ));
    const option = Get(TestID.OPTION);
    expect(option).toHaveValue('');
  });
  test('should show all options', () => {
    const arr = ['1', '2', '3'];
    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show>
          <For each={arr}>{v => <Option value={v} />}</For>
        </Dropdown>
      </SelectFakeCtx>
    ));

    const options = GetAll(TestID.OPTION);
    expect(options.length).toBe(arr.length);

    arr.forEach((value, i) => {
      expect(options[i]).toHaveTextContent(value);
    });
  });
  test('should filter options', () => {
    const arr = ['1', '2', '3'];
    const [search, setSearch] = createSignal(arr[0]);

    render(() => (
      <SelectFakeCtx>
        <Dropdown search={search()} value={v} show>
          <For each={arr}>{v => <Option value={v} />}</For>
        </Dropdown>
      </SelectFakeCtx>
    ));

    let options = GetAll(TestID.OPTION);
    expect(options.length).toBe(1);
    expect(options[0]).toHaveTextContent(search());

    const newValue = arr.at(-1)!;
    setSearch(newValue);

    options = GetAll(TestID.OPTION);
    expect(options.length).toBe(1);
    expect(options[0]).toHaveTextContent(search());
  });
  test('should emit onOpen', async () => {
    const onOpen = jest.fn();

    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show onOpen={onOpen} />
      </SelectFakeCtx>
    ));
    await tick(100);
    expect(onOpen).toBeCalled();
  });
  test('should emit onClose', async () => {
    const onClose = jest.fn();

    const [show, setShow] = createSignal(true);

    render(() => (
      <SelectFakeCtx>
        <Dropdown value={v} show={show()} onClose={onClose} />
      </SelectFakeCtx>
    ));

    setShow(false);
    await tick(100);
    expect(onClose).toBeCalled();
  });
});
