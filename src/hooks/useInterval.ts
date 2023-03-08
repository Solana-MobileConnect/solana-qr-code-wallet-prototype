// https://www.joshwcomeau.com/snippets/react-hooks/use-interval/

import { useRef, useEffect } from 'react'

export default function useInterval(callback: () => void, delay: number | null) {

  const intervalRef = useRef(undefined as number | undefined);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {

    const tick = () => savedCallback.current();
    
    if (delay != null) {
      intervalRef.current = window.setInterval(tick, delay);

      return () => window.clearInterval(intervalRef.current);
    }
  }, [delay]);

  return intervalRef;

}
