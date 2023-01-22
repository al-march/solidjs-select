import {CloseIcon} from '../icons';
import './Badge.css';
import {JSX, mergeProps, splitProps} from 'solid-js';

type Props = {
  onRemove?: () => void;
} & JSX.HTMLAttributes<HTMLSpanElement>;

export const Badge = (props: Props) => {
  const pr = mergeProps({class: '', classList: {}}, props);
  const [local, others] = splitProps(pr, [
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
      class="badge"
      classList={{
        [local.class]: !!local.class,
      }}
      {...others}
    >
      <span class="badge-label">{local.children}</span>
      <span class="badge-action" onClick={remove}>
        <button>
          <CloseIcon />
        </button>
      </span>
    </span>
  );
};
