import {Instance, createPopper as CreatePopper, Options} from '@popperjs/core';
import {Accessor, createEffect, createSignal, onCleanup} from 'solid-js';

export function createPopper<T extends HTMLElement>(
  referenceAccessor: Accessor<T | undefined | null>,
  popperAccessor: Accessor<T | undefined | null>,
  options: Partial<Options> = {}
): () => Instance | undefined {
  const [instance, setInstance] = createSignal<Instance>();

  createEffect(() => {
    const reference = referenceAccessor();
    const popper = popperAccessor();

    if (reference && popper) {
      const instance = CreatePopper(reference, popper, options);
      setInstance(instance);

      onCleanup(() => {
        instance.destroy();
      });
    }
  });

  onCleanup(() => {
    instance()?.destroy();
  });

  return () => instance();
}
