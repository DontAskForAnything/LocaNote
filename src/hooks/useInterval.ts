import React from "react";

// UseInterval by @Dan Abramov
function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = React.useRef<() => void>();

  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
