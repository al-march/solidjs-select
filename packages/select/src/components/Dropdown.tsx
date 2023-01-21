import {createPopper} from '../hooks';
import {Placement} from '@popperjs/core';
import {
  createEffect,
  createSignal,
  JSX,
  mergeProps,
  Show,
  splitProps,
} from 'solid-js';
import {Portal} from 'solid-js/web';

type Props = {
  trigger?: HTMLElement;
  show?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  placement?: Placement;
  offset?: [number, number];
} & JSX.HTMLAttributes<HTMLDivElement>;

type PropsDefault = Required<
  Pick<Props, 'placement' | 'offset' | 'show' | 'class' | 'classList'>
>;

const defaultProps: PropsDefault = {
  show: false,
  class: '',
  classList: {},
  placement: 'bottom',
  offset: [0, 8],
};

export const Dropdown = (props: Props) => {
  const pr = mergeProps(defaultProps, props);
  const [local, others] = splitProps(pr, [
    'show',
    'onOpen',
    'onClose',
    'placement',
    'offset',
    'trigger',
    'class',
    'classList',
    'children',
  ]);

  const [show, setShow] = createSignal(local.show);
  const [trigger, setTrigger] = createSignal(local.trigger);
  const [dropdown, setRef] = createSignal<HTMLElement>();

  createEffect(() => {
    if (local.show) {
      setShow(true);
    } else {
      setShow(false);
    }

    if (local.trigger !== trigger()) {
      setTrigger(local.trigger);
    }
  });

  /* Listen changes of placement */
  createEffect(prev => {
    if (local.placement !== prev) {
      initPopper();
    }
  }, local.placement);

  function initPopper() {
    createPopper(trigger, dropdown, {
      placement: local.placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: local.offset,
          },
        },
      ],
    });
  }

  return (
    <Show when={show()} keyed>
      <Portal>
        <div
          class="sol-select-dropdown"
          tabIndex={0}
          ref={el => {
            setRef(el);
            initPopper();
          }}
          classList={{
            ...local.classList,
          }}
          {...others}
        >
          {local.show && (
            <div class="sol-select-dropdown-options">{local.children}</div>
          )}
        </div>
      </Portal>
    </Show>
  );
};
