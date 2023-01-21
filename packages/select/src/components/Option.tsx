import {useSolSelect} from '../Select';
import {JSX, mergeProps, splitProps} from 'solid-js';

type Props = {
  value: string;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Option = (props: Props) => {
  const ctx = useSolSelect();
  const pr = mergeProps({value: '', class: '', classList: {}}, props);
  const [local, others] = splitProps(pr, [
    'type',
    'value',
    'class',
    'classList',
  ]);

  function check(e: Event) {
    e.preventDefault();
    ctx.select(local.value);
  }

  return (
    <button
      class="sol-select-option"
      classList={{
        [local.class]: !!local.class,
        ...local.classList,
      }}
      type="button"
      value={local.value}
      onClick={check}
      {...others}
    />
  );
};
