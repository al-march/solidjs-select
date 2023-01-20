import {JSX, mergeProps, splitProps} from 'solid-js';

type Props = {
  focused?: boolean;
  disabled?: boolean;
} & JSX.HTMLAttributes<HTMLDivElement>;

export const SelectArea = (props: Props) => {
  const pr = mergeProps(
    {class: '', classList: {}, focused: false, disabled: false},
    props
  );
  const [local, others] = splitProps(pr, [
    'focused',
    'disabled',
    'class',
    'classList',
  ]);

  return (
    <div
      class="sol-select-area"
      classList={{
        [local.class]: !!local.class,
        focused: local.focused,
        disabled: local.disabled,
        ...local.classList,
      }}
      {...others}
    />
  );
};
