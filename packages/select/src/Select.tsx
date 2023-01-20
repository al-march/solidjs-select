import './Select.css';
import {ArrowIcon} from './components/ArrowIcon';
import {SelectArea} from './components/SelectArea';
import {PropFocusEvent} from './types/event.type';
import {JSX, mergeProps, splitProps} from 'solid-js';
import {createStore} from 'solid-js/store';

type SolSelectState = {
  focused: boolean;
  disabled: boolean;

  inputRef?: HTMLInputElement;
};

type SolSelectProps = {
  placeholder?: string;
  disabled?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>;

const Select = (props: SolSelectProps) => {
  const pr = mergeProps({class: '', classList: {}, placeholder: ''}, props);
  const [local, others] = splitProps(pr, [
    'placeholder',
    'disabled',

    'onFocus',
    'onBlur',
    'onClick',

    'classList',
    'class',
  ]);

  const [state, setState] = createStore<SolSelectState>({
    focused: false,
    disabled: !!local.disabled,
  });

  function onFocus(e: PropFocusEvent<HTMLInputElement>) {
    setState('focused', true);

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

  return (
    <SelectArea
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
        <input
          ref={el => setState('inputRef', el)}
          type="text"
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={local.placeholder}
          disabled={local.disabled}
        />
      </div>
      <div class="sol-select-indicator">
        <ArrowIcon />
      </div>
    </SelectArea>
  );
};

export const SolSelect = Object.assign(Select, {});
