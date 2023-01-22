import {TestID} from '../../testID';
import {CloseIcon} from '../icons';
import './Badge.css';
import {JSX, mergeProps, Show, splitProps} from 'solid-js';

type Props = {
  hasAction?: boolean;
  onRemove?: () => void;
} & JSX.HTMLAttributes<HTMLSpanElement>;

export const Badge = (props: Props) => {
  const pr = mergeProps({class: '', classList: {}, hasAction: false}, props);
  const [local, others] = splitProps(pr, [
    'hasAction',
    'onRemove',
    'class',
    'classList',
    'children',
  ]);

  function remove() {
    if (typeof local.onRemove === 'function') {
      local.onRemove();
    }
  }

  return (
    <span
      data-testid={TestID.BADGE}
      class="badge"
      classList={{
        [local.class]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <span class="badge-label">{local.children}</span>

      <Show when={local.hasAction} keyed>
        <span
          data-testid={TestID.BADGE_ACTION}
          class="badge-action"
          onClick={remove}
        >
          <button>
            <CloseIcon />
          </button>
        </span>
      </Show>
    </span>
  );
};
