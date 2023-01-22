import {useSolSelect} from '../../Select';
import {TestID} from '../../testID';
import {PropClickEvent} from '../../types/event.type';
import {createMemo, JSX, mergeProps, Show, splitProps} from 'solid-js';

type Props = {
  value: string;
  empty?: boolean;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Option = (props: Props) => {
  const ctx = useSolSelect();
  const pr = mergeProps({value: '', class: '', classList: {}}, props);
  const [local, others] = splitProps(pr, [
    'type',
    'empty',
    'disabled',
    'value',
    'onClick',
    'class',
    'classList',
    'children',
  ]);

  const isShow = createMemo(() => !ctx.state.value.has(local.value));
  const isDisabled = createMemo(() => local.disabled || local.empty);

  function check(e: PropClickEvent<HTMLButtonElement>) {
    e.preventDefault();
    ctx.select(local.value);

    if (typeof local.onClick === 'function') {
      local.onClick(e);
    }
  }

  return (
    <Show when={isShow()} keyed>
      <button
        data-testid={TestID.OPTION}
        class="sol-select-option"
        classList={{
          [local.class]: !!local.class,
          empty: !!local.empty,
          ...local.classList,
        }}
        type="button"
        value={local.value}
        onClick={check}
        disabled={isDisabled()}
        {...others}
      >
        {local.children || local.value}
      </button>
    </Show>
  );
};
