import {createPopper} from '../../hooks';
import {TestID} from '../../testID';
import {Option} from '../option';
import {Scale} from '../transitions';
import {Instance, Placement} from '@popperjs/core';
import {
  Accessor,
  children,
  createEffect,
  createMemo,
  createSignal,
  JSX,
  mergeProps,
  on,
  onCleanup,
  Show,
  splitProps,
} from 'solid-js';
import {Portal} from 'solid-js/web';

type Props = {
  trigger?: HTMLElement;
  show?: boolean;
  search?: string;
  onOpen?: () => void;
  onClose?: () => void;
  placement?: Placement;
  offset?: [number, number];
  value: Accessor<any>;
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
    'value',
    'search',
    'class',
    'classList',
    'children',
  ]);

  let instance: () => Instance | undefined;
  const [show, setShow] = createSignal(local.show);
  const [trigger, setTrigger] = createSignal(local.trigger);
  const [dropdown, setRef] = createSignal<HTMLElement>();

  const list = children(() => local.children);

  const filteredList = createMemo(() => {
    let options = list() || [];

    if (!(options instanceof Array)) {
      options = [options];
    }

    return (options as HTMLButtonElement[])
      .filter(Boolean)
      .filter(filterButton);
  });

  function filterButton(btn: HTMLButtonElement) {
    if (!local.search?.length) {
      return true;
    }

    return (btn.textContent || btn.innerText || '')
      .toLowerCase()
      .includes(local.search);
  }

  const hasOptions = createMemo(() => !!filteredList().length);

  createEffect(() => {
    if (local.show) {
      setShow(true);
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

  /* Listen changes of value for Popper autoupdate */
  createEffect(
    on(props.value, () => {
      const popper = instance?.();
      popper?.forceUpdate();
    })
  );

  onCleanup(() => {
    const popper = instance?.();
    popper?.destroy();
  });

  function initPopper() {
    instance = createPopper(trigger, dropdown, {
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

  function onOpenEnd() {
    if (typeof local.onOpen === 'function') {
      local.onOpen();
    }
  }

  function onCloseEnd() {
    if (typeof local.onClose === 'function') {
      local.onClose();
    }
  }

  return (
    <Show when={show()} keyed>
      <Portal>
        <div
          data-testid={TestID.DROPDOWN}
          class="sol-select-dropdown"
          tabIndex={0}
          ref={el => {
            setRef(el);
            initPopper();
          }}
          classList={{
            [local.class]: !!local.class,
            ...local.classList,
          }}
          {...others}
        >
          <Scale
            appear
            onEnterDone={() => {
              onOpenEnd();
            }}
            onExitDone={() => {
              setShow(false);
              onCloseEnd();
            }}
          >
            {local.show && (
              <div class="sol-select-dropdown-options">
                <Show when={!hasOptions()} keyed>
                  <Option value="" empty>
                    No Options
                  </Option>
                </Show>

                {filteredList()}
              </div>
            )}
          </Scale>
        </div>
      </Portal>
    </Show>
  );
};
