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
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.0436 7.39429C6.7153 7.72259 6.1833 7.72259 5.8557 7.39429L4 5.27329L2.1443 7.39359C1.816 7.72189 1.284 7.72189 0.956398 7.39359C0.628098 7.06529 0.628098 6.53329 0.956398 6.20569L2.887 4.00069L0.955698 1.79429C0.627398 1.46599 0.627398 0.934693 0.955698 0.606393C1.284 0.278093 1.8153 0.278093 2.1436 0.606393L4 2.72809L5.8557 0.606393C6.184 0.278093 6.7153 0.278093 7.0436 0.606393C7.3719 0.934693 7.3719 1.46669 7.0436 1.79429L5.113 4.00069L7.0436 6.20569C7.3719 6.53399 7.3719 7.06599 7.0436 7.39429V7.39429Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </span>
    </span>
  );
};
