import {ParentProps} from 'solid-js';
import {Transition} from 'solid-transition-group';

type Props = {
  appear?: boolean;
  onExitDone?: () => void;
  onEnterDone?: () => void;
};

export const Scale = (props: ParentProps<Props>) => {
  const onEnterDone = () => {
    props.onEnterDone?.();
  };

  const onExitDone = () => {
    props.onExitDone?.();
  };

  return (
    <Transition
      appear={props.appear}
      onBeforeEnter={el => ((el as HTMLElement).style.opacity = '0')}
      onEnter={async (el, done) => {
        await el.animate?.(
          [
            {
              opacity: 0,
              transform: 'scale(1, 0.8)',
            },
            {
              opacity: 1,
              transform: 'scale(1, 1)',
            },
          ],
          {
            duration: 120,
            easing: 'cubic-bezier(0, 0, 0.2, 1)',
          }
        ).finished;
        onEnterDone();
        done();
      }}
      onAfterEnter={el => ((el as HTMLElement).style.opacity = '1')}
      onExit={async (el, done) => {
        await el.animate?.(
          [
            {
              opacity: 1,
            },
            {
              opacity: 0,
            },
          ],
          {
            duration: 120,
            easing: 'linear',
          }
        ).finished;
        onExitDone();
        done();
      }}
    >
      {props.children}
    </Transition>
  );
};
