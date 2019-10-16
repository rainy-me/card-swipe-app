import React from 'react';
// import {
//   useSprings,
//   animated,
//   interpolate,
//   UseSpringProps,
//   AnimatedValue
// } from "react-spring";

import { useSpring, animated } from 'react-spring';

interface Props {}

const Card: React.FC<Props> = () => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <div>
      <animated.h1 style={props}>hello</animated.h1>
    </div>
  );
};

export default Card;