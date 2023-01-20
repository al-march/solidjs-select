import './Select.css';
import {PropFocusEvent} from './types/event.type';
import {JSX, mergeProps, splitProps} from 'solid-js';
import {createStore} from 'solid-js/store';

type SolSelectState = {
  focused: boolean;

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
    <div
      class="sol-select"
      classList={{
        [local.class]: !!local.class,
        focused: state.focused,
        disabled: local.disabled,
        ...local.classList,
      }}
      onClick={e => {
        focusInput();
        if (typeof local.onClick === 'function') {
          local.onClick(e);
        }
      }}
      {...others}
    >
      <input
        ref={el => setState('inputRef', el)}
        type="text"
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={local.placeholder}
      />
    </div>
  );
};

export const SolSelect = Object.assign(Select, {});
