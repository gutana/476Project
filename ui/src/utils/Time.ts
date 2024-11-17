const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (date: string) => {
  let year = date.slice(0, 4);
  let month = parseInt(date.slice(5, 7), 10);
  let day = parseInt(date.slice(8, 10), 10);

  return `${months[month - 1]} ${day}, ${year}`;
};

export const formatTime = (time: string) => {
  let dateTime = new Date(time);
  let hours = dateTime.getUTCHours();
  if (hours > 12) hours -= 12;
  return hours + ":" + dateTime.getUTCMinutes() + dateTime.toLocaleTimeString().slice(-3);
}

export const addDays = (date: Date, daysAdded: number) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysAdded);
  return newDate;
}
