export default (dateFromDB) => {
  let dateString = null;

  const pastDate = new Date(dateFromDB);
  const currentDate = new Date();

  const difference = currentDate - pastDate;
  const days = Math.round(difference / (1000 * 60 * 60 * 24));
  const hours = Math.round(difference / (1000 * 60 * 60));
  const mins = Math.round(difference / (1000 * 60));
  const secs = Math.round(difference / 1000);

  if (days > 0) {
    if (days === 1) {
      dateString = "a day";
    } else {
      dateString = `${days} days`;
    }
  } else if (hours > 0) {
    if (hours === 1) {
      dateString = "an hour";
    } else {
      dateString = `${hours} hours`;
    }
  } else if (mins > 0) {
    if (mins === 1) {
      dateString = "a min";
    } else {
      dateString = `${mins} mins`;
    }
  } else if (secs >= 0) {
    if (secs === 1 || secs === 0) {
      dateString = `a moment`;
    } else {
      dateString = `${secs} secs`;
    }
  }

  return dateString;
};
