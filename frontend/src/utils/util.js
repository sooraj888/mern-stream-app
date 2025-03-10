export function ago(ms) {
  const seconds = Math.floor((Date.now() - Date.parse(ms)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years";
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }

  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }

  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }

  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }

  return Math.floor(seconds) + " seconds ago";
}

export function convertSecondsToTime(seconds) {
  const sec = Math.round(seconds);
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSeconds = sec % 60;
  return [hours, minutes, remainingSeconds]
    .map((val) => (val < 10 ? `0${val}` : val)) // Adding leading zeros if needed
    .join(":");
}
