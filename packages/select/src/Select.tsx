import './Select.css';
import {Dropdown} from './components/Dropdown';
import {Option} from './components/Option';
import {SelectArea} from './components/SelectArea';
import {SelectValue} from './components/SelectValue';
import {ArrowIcon, CloseIcon} from './components/icons';
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

type SolSelectState = {
  value: Set<string>;

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

  onSelect?: (v: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
} & JSX.HTMLAttributes<HTMLDivElement>;

const Select = (props: SolSelectProps) => {
  const pr = mergeProps({class: '', classList: {}, placeholder: ''}, props);
  const [local, others] = splitProps(pr, [
    'placeholder',
    'disabled',
    'multiple',

    'onFocus',
    'onBlur',
    'onClick',

    'onSelect',
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

    get opened() {
      return this.focused;
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

  function select(v: string) {
    let set = new Set<string>();

    if (local.multiple) {
      set = new Set(state.value);
      focusInput();
    } else {
      blurInput();
    }

    set.add(v);
    setState('value', set);

    if (typeof local.onSelect === 'function') {
      local.onSelect(v);
    }
  }

  function reset() {
    setState('value', new Set());
  }

  function removeValue(value: string) {
    setTimeout(() => {
      const set = state.value;
      set.delete(value);
      setState('value', new Set(set));
      focusInput();
    });
  }

  function isPartOfDropdown(el: unknown) {
    if (el instanceof HTMLElement) {
      return state.dropdownRef?.contains(el);
    }
    return false;
  }

  function isPartOfSelect(el: unknown) {
    if (el instanceof HTMLElement) {
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
        <div class="sol-select-value">
          <SelectValue
            values={selected()}
            multiple={local.multiple}
            onRemove={removeValue}
          />

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
