import {Badge} from './Badge';
import {createMemo, For, Match, Show, Switch} from 'solid-js';

type Props = {
  multiple?: boolean;
  values: string[];

  onRemove?: (v: string) => void;
};

export const SelectValue = (props: Props) => {
  const hasValue = createMemo(() => props.values.length);

  return (
    <Show when={hasValue()} keyed>
      <Switch>
        <Match when={!props.multiple} keyed>
          <span>{props.values[0]}</span>
        </Match>
        <Match when={props.multiple} keyed>
          <For each={props.values}>
            {value => (
              <Badge onRemove={() => props.onRemove?.(value)}>{value}</Badge>
            )}
          </For>
        </Match>
      </Switch>
    </Show>
  );
};
