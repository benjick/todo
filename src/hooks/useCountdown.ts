import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import lofiBells from "../../assets/lofi-bells.mp3";
import { default as dayjs } from "dayjs";

export function useCountdown(running: boolean, minutes: number) {
  const [endTime, setEndTime] = useState<Date>();
  const [currentTime, setCurrentTime] = useState<Date>();

  const hasDates = endTime && currentTime;
  const timeleft = dayjs(endTime).diff(currentTime);

  const [play, { stop }] = useSound(lofiBells);
  const intervalRef = useRef<NodeJS.Timer>();

  // Starting and stopping the countdown
  useEffect(() => {
    if (running) {
      setEndTime(dayjs().add(minutes, "minutes").toDate());
      intervalRef.current = setInterval(() => {
        setCurrentTime(new Date());
      }, 99);
    } else if (intervalRef.current) {
      stop();
      clearInterval(intervalRef.current);
    }
  }, [running, stop, minutes]);

  // End the timer when time = 0
  useEffect(() => {
    if (running && hasDates && intervalRef.current && timeleft < 1) {
      play();
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, [timeleft, play, running, hasDates]);

  return { timeleft };
}
