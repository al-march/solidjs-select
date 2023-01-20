import './Select.css';
import {ArrowIcon} from './components/ArrowIcon';
import {Dropdown} from './components/Dropdown';
import {Option} from './components/Option';
import {SelectArea} from './components/SelectArea';
import {PropFocusEvent} from './types/event.type';
import {
  createContext,
  createMemo,
  For,
  JSX,
  mergeProps,
  splitProps,
  useContext,
} from 'solid-js';
import {createStore} from 'solid-js/store';

type SolSelectState = {
  value: Set<string>;

  focused: boolean;
  disabled: boolean;

  opened: boolean;
  closed: boolean;

  selectRef?: HTMLElement;
  inputRef?: HTMLInputElement;
};

type SolSelectActions = {
  checkOption: (v: string) => void;
  reset: () => void;
};

type SolSelectProps = {
  placeholder?: string;
  disabled?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
} & JSX.HTMLAttributes<HTMLDivElement>;

const Select = (props: SolSelectProps) => {
  const pr = mergeProps({class: '', classList: {}, placeholder: ''}, props);
  const [local, others] = splitProps(pr, [
    'placeholder',
    'disabled',

    'onFocus',
    'onBlur',
    'onClick',

    'onOpen',
    'onClose',

    'classList',
    'class',
    'children',
    'ref',
  ]);

  const [state, setState] = createStore<SolSelectState>({
    value: new Set(),
    focused: false,
    disabled: !!local.disabled,

    opened: false,
    get closed() {
      return !this.opened;
    },
  });

  const selected = createMemo(() => [...state.value]);

  function onFocus(e: PropFocusEvent<HTMLInputElement>) {
    setState('focused', true);
    setState('opened', true);

    if (typeof local.onFocus === 'function') {
      local.onFocus(e);
    }
  }

  function onBlur(e: PropFocusEvent<HTMLInputElement>) {
    setState('focused', false);

    if (typeof local.onBlur === 'function') {
      local.onBlur(e);
    }
  }

  function focusInput() {
    state.inputRef?.focus();
  }

  function checkOption(v: string) {
    const set = new Set<string>();
    set.add(v);
    setState('value', set);
    setState('opened', false);
  }

  function reset() {
    setState('value', new Set());
  }

  return (
    <SolSelectCtx.Provider
      value={{
        state,
        checkOption,
        reset,
      }}
    >
      <SelectArea
        ref={el => {
          setState('selectRef', el);
          if (typeof local.ref === 'function') {
            local.ref(el);
          }
        }}
        class={local.class}
        classList={local.classList}
        focused={state.focused}
        disabled={state.disabled}
        onClick={e => {
          focusInput();
          if (typeof local.onClick === 'function') {
            local.onClick(e);
          }
        }}
        {...others}
      >
        <div class="sol-select-value">
          <For each={selected()}>{value => <span>{value}</span>}</For>
          <input
            ref={el => setState('inputRef', el)}
            type="text"
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={!state.value.size ? local.placeholder : ''}
            disabled={local.disabled}
          />
        </div>
        <div class="sol-select-indicator">
          <ArrowIcon />
        </div>
      </SelectArea>

      <Dropdown
        trigger={state.selectRef}
        show={state.opened}
        onOpen={local.onOpen}
        onClose={local.onClose}
      >
        {local.children}
      </Dropdown>
    </SolSelectCtx.Provider>
  );
};

export const SolSelect = Object.assign(Select, {
  Option,
});

type SolSelectCtx = {
  state: SolSelectState;
} & SolSelectActions;

const SolSelectCtx = createContext<SolSelectCtx>();

export const useSolSelect = () => {
  const ctx = useContext(SolSelectCtx);
  if (ctx) {
    return ctx;
  }

  throw new Error('No context for autocomplete');
};
