export default (dateFromDB) => {
    let uploadDate = null

    const year =
        new Date().getFullYear() - new Date(dateFromDB).getFullYear();
    const month =
        new Date().getMonth() +
        1 -
        (new Date(dateFromDB).getMonth() + 1);
    const date =
        new Date().getDate() - new Date(dateFromDB).getDate();
    const hour =
        new Date().getHours() - new Date(dateFromDB).getHours();
    const min =
        new Date().getMinutes() - new Date(dateFromDB).getMinutes();
    const sec =
        new Date().getSeconds() - new Date(dateFromDB).getSeconds();
    if (year > 0) {
        if (year === 1) {
            uploadDate = "1 year";
        } else {
            uploadDate = `${year} years`;
        }
    } else if (month > 0) {
        if (month === 1) {
            uploadDate = "1 month";
        } else {
            uploadDate = `${month} months`;
        }
    } else if (date > 0) {
        if (date === 1) {
            uploadDate = "1 day";
        } else {
            uploadDate = `${date} days`;
        }
    } else if (hour > 0) {
        if (hour === 1) {
            uploadDate = "1 hour";
        } else {
            uploadDate = `${hour} hours`;
        }
    } else if (min > 0) {
        if (min === 1) {
            uploadDate = "1 min";
        } else {
            uploadDate = `${min} mins`;
        }
    } else if (sec >= 0) {
        if (sec === 1 || sec === 0) {
            uploadDate = `${sec} sec`;
        } else {
            uploadDate = `${sec} secs`;
        }
    }

    return uploadDate
}