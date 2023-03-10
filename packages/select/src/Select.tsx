import './Select.css';
import {Dropdown} from './components/dropdown';
import {ArrowIcon, CloseIcon} from './components/icons';
import {Option} from './components/option';
import {SelectArea, SelectValue} from './components/select';
import {PropFocusEvent} from './types/event.type';
import {
  createContext,
  createMemo,
  JSX,
  mergeProps,
  Show,
  splitProps,
  useContext,
} from 'solid-js';
import {createStore} from 'solid-js/store';

export type SolSelectState = {
  value: Set<string>;
  search: string;

  focused: boolean;
  disabled: boolean;

  opened: boolean;
  closed: boolean;

  selectRef?: HTMLElement;
  inputRef?: HTMLInputElement;
  dropdownRef?: HTMLInputElement;
};

type SolSelectActions = {
  select: (v: string) => void;
  reset: () => void;
};

type SolSelectProps = {
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  show?: boolean;
  // Width of dropdown according SelectArea
  dropdownAsSelect?: boolean;

  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (search: string) => void;
  onSelect?: (value: string) => void;
  onChange?: (value: string | string[]) => void;
} & JSX.HTMLAttributes<HTMLDivElement>;

const Select = (props: SolSelectProps) => {
  const pr = mergeProps({class: '', classList: {}, placeholder: ''}, props);
  const [local, others] = splitProps(pr, [
    'placeholder',
    'disabled',
    'multiple',
    'dropdownAsSelect',
    'show',

    'onFocus',
    'onBlur',
    'onClick',

    'onOpen',
    'onClose',
    'onSearch',
    'onSelect',
    'onChange',

    'classList',
    'class',
    'children',
    'ref',
  ]);

  const [state, setState] = createStore<SolSelectState>({
    value: new Set(),
    focused: false,
    disabled: !!local.disabled,
    search: '',

    get opened() {
      return this.focused || (local.show && this.selectRef);
    },
    get closed() {
      return !this.opened;
    },
  });

  const selected = createMemo(() => [...state.value]);

  function onFocus(e: PropFocusEvent<HTMLInputElement>) {
    setState('focused', true);

    if (typeof local.onFocus === 'function') {
      local.onFocus(e);
    }
  }

  function onBlur(e: PropFocusEvent<HTMLInputElement>) {
    if (isPartOfDropdown(e.relatedTarget) || isPartOfSelect(e.relatedTarget)) {
      e.preventDefault();
      focusInput();
      return;
    }

    setState('focused', false);
    resetInput();
    if (typeof local.onBlur === 'function') {
      local.onBlur(e);
    }
  }

  function focusInput() {
    state.inputRef?.focus();
  }

  function blurInput() {
    state.inputRef?.blur();
  }

  function resetInput() {
    const input = state.inputRef;
    if (input) {
      input.value = '';
      setState('search', '');
      onSearchChange();
    }
  }

  function select(v: string) {
    let set = new Set<string>();

    if (local.multiple) {
      set = new Set(state.value);
      focusInput();
    } else {
      blurInput();
    }

    set.add(v);
    setValue(set);

    if (typeof local.onSelect === 'function') {
      local.onSelect(v);
    }
  }

  function reset() {
    setValue(new Set());
  }

  function removeValue(value: string) {
    const set = state.value;
    set.delete(value);
    setValue(new Set(set));
    focusInput();
  }

  function onSearch(search = '') {
    setState('search', search.toLowerCase());
    onSearchChange();
  }

  function setValue(value: Set<string>) {
    setState('value', value);
    onValueChange();
  }

  function onValueChange() {
    if (typeof local.onChange === 'function') {
      if (local.multiple) {
        local.onChange(Array.from(state.value));
      } else {
        local.onChange(Array.from(state.value)[0]);
      }
    }
  }

  function onSearchChange() {
    if (typeof local.onSearch === 'function') {
      local.onSearch(state.search);
    }
  }

  function isPartOfDropdown(el: unknown) {
    if (el instanceof Node) {
      return state.dropdownRef?.contains(el);
    }
    return false;
  }

  function isPartOfSelect(el: unknown) {
    if (el instanceof Node) {
      return state.selectRef?.contains(el);
    }
    return false;
  }

  return (
    <SolSelectCtx.Provider
      value={{
        state,
        select,
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
        <SelectValue
          values={selected()}
          multiple={local.multiple}
          onRemove={removeValue}
        >
          <div class="sol-select-input">
            <input
              ref={el => setState('inputRef', el)}
              type="text"
              onFocus={onFocus}
              onBlur={onBlur}
              onInput={e => onSearch(e.currentTarget.value)}
              placeholder={!state.value.size ? local.placeholder : ''}
              disabled={local.disabled}
            />
          </div>
        </SelectValue>

        <div class="sol-select-indicator">
          <div class="sol-select-state">
            <Show when={!!selected().length} keyed>
              <button
                class="sol-select-reset"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  reset();
                  blurInput();
                }}
              >
                <CloseIcon />
              </button>
            </Show>
          </div>
          <div class="sol-select-divider" />
          <div class="sol-select-icon">
            <ArrowIcon />
          </div>
        </div>
      </SelectArea>

      <Dropdown
        ref={el => setState('dropdownRef', el)}
        trigger={state.selectRef}
        show={state.opened}
        value={selected}
        search={state.search}
        onOpen={local.onOpen}
        onClose={local.onClose}
        style={{
          'min-width': `${state.selectRef?.offsetWidth}px`,
          'max-width': local.dropdownAsSelect
            ? `${state.selectRef?.offsetWidth}px`
            : 'auto',
        }}
      >
        {local.children}
      </Dropdown>
    </SolSelectCtx.Provider>
  );
};

export const SolSelect = Object.assign(Select, {
  Option,
});

export type SolSelectCtx = {
  state: SolSelectState;
} & SolSelectActions;

export const SolSelectCtx = createContext<SolSelectCtx>();

export const useSolSelect = () => {
  const ctx = useContext(SolSelectCtx);
  if (ctx) {
    return ctx;
  }

  throw new Error('No context for autocomplete');
};
