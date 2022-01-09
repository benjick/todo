import { default as dayjs } from "dayjs";
import { Item, Event } from "./state";

export function msToTime(s: number) {
  function pad(n: number, l = 2) {
    return n.toString().padStart(l, "0");
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);
}

function getCompareData(resetAfterDays?: number) {
  if (!resetAfterDays || resetAfterDays < 1) {
    return undefined;
  }
  return dayjs().subtract(resetAfterDays, "days").endOf("day");
}

export function isItemDone(
  events: Event[],
  item: Item,
  resetAfterDays?: number
) {
  const compareDate = getCompareData(resetAfterDays);
  const latestEvent = events.find((event) => event.item === item.id);

  if (!latestEvent) {
    return false;
  }

  if (compareDate && dayjs(latestEvent.date).isAfter(compareDate)) {
    return latestEvent.id;
  }

  if (!compareDate) {
    return latestEvent.id;
  }

  return false;
}
