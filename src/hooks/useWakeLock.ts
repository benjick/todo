import { useRef, useEffect } from "react";

export function useWakeLock(active: boolean) {
  const wakeLock = useRef<WakeLockSentinel>();

  useEffect(() => {
    if ("wakeLock" in navigator) {
      if (active) {
        navigator.wakeLock
          .request("screen")
          .then((_wakeLock) => (wakeLock.current = _wakeLock));
      } else {
        wakeLock.current &&
          wakeLock.current.release().then(() => (wakeLock.current = undefined));
      }
    } else {
      console.log("wakeLock not supported");
    }
  }, [active]);
}
