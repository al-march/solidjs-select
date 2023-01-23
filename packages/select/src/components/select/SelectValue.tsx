import {TestID} from '../../testID';
import {Badge} from '../badge';
import {createMemo, For, JSX, Match, Show, splitProps, Switch} from 'solid-js';

type Props = {
  multiple?: boolean;
  values: string[];
  onRemove?: (v: string) => void;
} & JSX.HTMLAttributes<HTMLDivElement>;

export const SelectValue = (props: Props) => {
  const [local, others] = splitProps(props, [
    'multiple',
    'values',
    'onRemove',
    'children',
    'class',
    'classList',
  ]);

  const hasValue = createMemo(() => local.values.length);

  return (
    <div
      data-testid={TestID.SELECT_VALUE}
      class="sol-select-content"
      classList={{
        [local.class || '']: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <Show when={hasValue()} keyed>
        <Switch>
          <Match when={!local.multiple} keyed>
            <span>{local.values[0]}</span>
          </Match>
          <Match when={local.multiple} keyed>
            <For each={local.values}>
              {value => (
                <Badge hasAction onRemove={() => local.onRemove?.(value)}>
                  {value}
                </Badge>
              )}
            </For>
          </Match>
        </Switch>
      </Show>

      {local.children}
    </div>
  );
};
