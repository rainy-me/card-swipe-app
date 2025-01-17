import React, { useState, useEffect } from 'react';
import { useSprings, UseSpringProps, AnimatedValue } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import Button from '../components/Button';
import CardComponent, { DeckProps } from '../components/Card';

type useSpringsOverride<T extends Object> = [
  AnimatedValue<T>[],
  (callback: (i: number) => Partial<UseSpringProps<T>> | undefined) => void,
];

type Props = {
  cards: User[];
  setLoading: (loading: boolean) => void;
  setPageNum: (PageNum: number) => void;
};

type Animation = {
  index: number;
  down: boolean;
  xDelta: number;
  xDir: number;
  velocity: number;
};

type animationFunction = (arg: Animation) => void;

const Card: React.FC<Props> = ({ cards, setLoading, setPageNum }) => {
  const [length, setLength] = useState(cards.length);
  const [gone] = useState<Set<number>>(() => new Set());
  const [count, setCount] = useState(1);
  const [deckList, set] = useSprings<DeckProps>(cards.length, (i) => ({
    x: 0,
    y: i * -4,
    scale: 1,
    rot: 0,
    delay: 0,
    from: { x: 0, rot: 0, scale: 1, y: 0 },
  })) as useSpringsOverride<DeckProps>;

  useEffect(() => {
    if (gone.size === cards.length) {
      setLoading(true);
    }
    if (gone.size === 20) {
      setCount(count + 1);
      setPageNum(count);
    }
  });

  // useEffect(() => {
  //   setPageNum(count);
  // }, [count]);

  useEffect(() => {
    setLength(cards.length);
  }, [cards]);

  const bind = useDrag(({ args: [index], down, delta: [xDelta], direction: [xDir], velocity }) => {
    animation({ index, down, xDelta, xDir, velocity });
  });

  const handleRightClick = () => {
    if (length <= 0) {
      return;
    }
    animation({
      index: length - 1,
      down: false,
      xDelta: 100,
      xDir: 1,
      velocity: 0.3,
    });
  };

  const handleLeftClick = () => {
    if (length <= 0) {
      return;
    }
    animation({
      index: length - 1,
      down: false,
      xDelta: -100,
      xDir: -1,
      velocity: 0.3,
    });
  };

  const animation: animationFunction = ({ index, down, xDelta, xDir, velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!down && trigger) gone.add(index);
    set((i) => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;
      const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;
      if (isGone) {
        setLength(index);
      }
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
  };

  const mouseDownLeft = () => {
    // console.log('moving');
    // TODO: buttonの長押しでstyleの変更
  };
  const mouseDownRight = () => {
    // console.log('moving');
    // TODO: buttonの長押しでstyleの変更
  };

  return (
    <>
      <Button
        onClickRight={handleRightClick}
        onClickLeft={handleLeftClick}
        onMouseDownLeft={mouseDownLeft}
        onMouseDownRight={mouseDownRight}
      />
      <CardComponent deckList={deckList} bind={bind} cards={cards} />
    </>
  );
};

export default Card;
