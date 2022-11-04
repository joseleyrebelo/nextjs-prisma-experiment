// @source - https://stackoverflow.com/a/42234988
// - https://stackoverflow.com/questions/67631847/types-of-parameters-event-and-event-are-incompatible

import React, { useEffect, useState } from "react";

const onClickedOut = (ref: React.RefObject<Element>, callback: () => void) => {
  const [state, setState] = useState(false);
  useEffect(() => {
    const handler = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(<Node>event!.target)) {
        callback();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [ref]);
  return state;
};

export default onClickedOut;
