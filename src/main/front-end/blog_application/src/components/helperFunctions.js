import moment from "moment";

export function lastUpdated(time) {
  return moment(time).local().startOf("seconds").fromNow();
}

