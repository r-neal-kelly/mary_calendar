MaryManage.define("model/calendar", [
  "utils"
], function modelCalendar(utils, require) {

/* constants */
const newObj = utils.newObj;
const padOneNumber = utils.padOneNumber;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const parseHours24 = utils.parseHours24;

/* constructor */
const Calendar = function (equinox, sunDown) {
  const calendar = newObj(Calendar.prototype);
  const data = newObj();
  data.equinox = parseEquinox(equinox);
  data.sunDown = parseSunDown(sunDown);
  getFirstDay(data);
  getTotalDays(data);
  generateHebrewMonths(data);
  generatePaganMonths(data);
  addSabbaths(data);
  addSpecials(data);
  ifLeapYear(data);
  generateHebrewYear(data);
  generatePaganYear(data);
  addDates(data);
  addDayNames(data);
  getCurrentDay(data);
  calendar.months = data.hebrewMonths;
  calendar.currentDay = data.currentDay;
  return calendar;
};

/* functions */
const getFirstDay = function ({equinox}) {
  // get the Gregorian day that equates to the start of Abib 1
  const data = arguments[0];
  const hours = equinox.hours;
  const minutes = padOneNumber(equinox.minutes);
  const cycle = equinox.cycle;
  const theTime = Number(hours + minutes);
  let day = Number(equinox.day);
  if (cycle === "PM" && theTime >= 730 && theTime < 1200) {
    // That is, if it's too late to see the sun equinox
    day += 1;
  }
  data.firstDay = day;
};

const getTotalDays = function ({equinox}) {
  // Hebrew year includes next February, which can be a leap year
  const data = arguments[0];
  const nextYear = Number(equinox.year) + 1;
  if (nextYear % 4 === 0) {
    data.totalDays = 366;
  } else {
    data.totalDays = 365;
  }
};

const generateLinks = function (monthArray) {
  monthArray.forEach(function (month, index, array) {
    array[month.name] = month;
  });
};

const generateHebrewMonths = function (data) {
  const Month = function (name, totalDays) {
    const month = newObj();
    month.name = name;
    month.totalDays = totalDays;
    for (let d = 1; d <= totalDays; d += 1) {
      month["day" + d] = newObj();
      month["day" + d].month = name;
      month["day" + d].day = String(d);
      month["day" + d].sabbath = "no"; // default
      month["day" + d].special = "none"; // default
      month["day" + d].date = "";
      month["day" + d].dayName = "";
    }
    return month;
  };
  const months = [
    Month("Abib", 30),
    Month("Zif", 30),
    Month("Sivan", 31),
    Month("Thammuz", 30),
    Month("Ab", 30),
    Month("Elul", 31),
    Month("Ethanim", 30),
    Month("Bul", 30),
    Month("Chisleu", 31),
    Month("Tebeth", 30),
    Month("Sebat", 30),
    Month("Adar", 32)
  ];
  generateLinks(months);
  data.hebrewMonths = months;
};

const generatePaganMonths = function (data) {
  const Month = function (name, totalDays) {
    const month = newObj();
    month.name = name;
    month.totalDays = totalDays;
    return month;
  };
  const months = [
    Month("January", 31),
    Month("February", 28),
    Month("March", 31),
    Month("April", 30),
    Month("May", 31),
    Month("June", 30),
    Month("July", 31),
    Month("August", 31),
    Month("September", 30),
    Month("October", 31),
    Month("November", 30),
    Month("December", 31)
  ];
  generateLinks(months);
  data.paganMonths = months;
};

const addSabbaths = function ({hebrewMonths}) {
  const hM = hebrewMonths;
  // m = month, d = day, m0 = Abib
  for (let m = 0; m < hM.length; m += 1) {
    if (m === 0 || m === 3 || m === 6 || m === 9) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 4 || d === 11 || d === 18 || d === 25) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
    if (m === 1 || m === 4 || m === 7 || m === 10) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 2 || d === 9 || d === 16 || d === 23 || d === 30) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
    if (m === 2 || m === 5 || m === 8 || m === 11) {
      for (let d = 1; d <= hM[m].totalDays; d += 1) {
        if (d === 7 || d === 14 || d === 21 || d === 28) {
          hM[m]["day" + d].sabbath = "yes";
        }
      }
    }
  }
};

const addSpecials = function ({hebrewMonths}) {
  const hM = hebrewMonths;
  // Adds Passover, and Feast of Unleavened Bread
  hM.Abib.day14.special = "Passover";
  hM.Abib.day15.special = "Feast of Unleavened Bread 1";
  hM.Abib.day15.sabbath = "yes";
  hM.Abib.day16.special = "Feast of Unleavened Bread 2";
  hM.Abib.day17.special = "Feast of Unleavened Bread 3";
  hM.Abib.day18.special = "Feast of Unleavened Bread 4";
  hM.Abib.day19.special = "Feast of Unleavened Bread 5";
  hM.Abib.day20.special = "Feast of Unleavened Bread 6";
  hM.Abib.day21.special = "Feast of Unleavened Bread 7";
  hM.Abib.day21.sabbath = "yes";
  hM.Abib.day26.special = "Feast of First Fruits";
  // Adds Make-Up Passover
  hM.Zif.day14.special = "Make-Up Passover";
  // Adds Feast of Weeks
  hM.Sivan.day15.special = "Feast of Weeks";
  hM.Sivan.day15.sabbath = "yes";
  // Adds Feast of Trumpets, Day of Atonement, and Feast of Tabernacles
  hM.Ethanim.day1.special = "Feast of Trumpets";
  hM.Ethanim.day1.sabbath = "yes";
  hM.Ethanim.day10.special = "Day of Atonement";
  hM.Ethanim.day10.sabbath = "yes";
  hM.Ethanim.day15.special = "Feast of Tabernacles 1";
  hM.Ethanim.day15.sabbath = "yes";
  hM.Ethanim.day16.special = "Feast of Tabernacles 2";
  hM.Ethanim.day17.special = "Feast of Tabernacles 3";
  hM.Ethanim.day18.special = "Feast of Tabernacles 4";
  hM.Ethanim.day19.special = "Feast of Tabernacles 5";
  hM.Ethanim.day20.special = "Feast of Tabernacles 6";
  hM.Ethanim.day21.special = "Feast of Tabernacles 7";
  hM.Ethanim.day22.special = "Feast of Tabernacles 8";
  hM.Ethanim.day22.sabbath = "yes";
  // Adds seasonal days
  hM.Sivan.day31.special = "Summer Season Day";
  hM.Elul.day31.special = "Fall Season Day";
  hM.Chisleu.day31.special = "Winter Season Day";
  hM.Adar.day31.special = "Spring Season Day";
  hM.Adar.day32.special = "Vernal Equinox / Free Day";
};

const ifLeapYear = function ({hebrewMonths, paganMonths, totalDays}) {
  const hM = hebrewMonths;
  const pM = paganMonths;
  if (totalDays === 366) {
    hM.Adar.totalDays = 33;
    pM.February.totalDays = 29;
    hM.Adar.day33 = newObj();
    hM.Adar.day33.month = "Adar";
    hM.Adar.day33.day = "33";
    hM.Adar.day33.sabbath = "no";
    hM.Adar.day33.special = "Vernal Equinox / Free Day";
    hM.Adar.day33.date = "";
    hM.Adar.day33.dayName = "";
  }
};

const generateHebrewYear = function ({hebrewMonths}) {
  // makes an array where each item is a day instead of a month
  const data = arguments[0];
  const year = [];
  for (let month of hebrewMonths) {
    for (let d = 1; d <= month.totalDays; d += 1) {
      year.push(month["day" + d]);
    }
  }
  data.hebrewYear = year;
};

const generatePaganYear = function ({paganMonths, equinox, firstDay}) {
  // makes an re-orders an array of dates from paganMonths
  const data = arguments[0];
  const equinoxYear = Number(equinox.year);
  let year = [];
  let nextYear;
  for (let month of paganMonths) {
    for (let d = 1; d <= month.totalDays; d += 1) {
      year.push(month.name + " " + d);
    }
  }
  firstDay = year.indexOf("March " + firstDay);
  nextYear = year.slice(0, firstDay);
  year = year.slice(firstDay);
  for (let [i, day] of year.entries()) {
    year[i] = day + " " + equinoxYear;
  }
  for (let [i, day] of nextYear.entries()) {
    nextYear[i] = day + " " + (equinoxYear + 1);
  }
  data.paganYear = [...year, ...nextYear];
};

const addDates = function ({equinox, hebrewYear, paganYear}) {
  let equinoxYear = Number(equinox.year);
  // Having matched arrays, we add each date to the Hebrew days
  for (let i = 0; i < hebrewYear.length; i += 1) {
    if (i === hebrewYear.length - 1) {
      // if the last day of the year
      hebrewYear[i].date =
        paganYear[i] + " - " + "Equinox " + (equinoxYear + 1);
    } else {
      hebrewYear[i].date =
        paganYear[i] + " - " + paganYear[i + 1];
    }
  }
};

const addDayNames = function ({equinox, firstDay, hebrewYear}) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const year = Number(equinox.year);
  let nightTime = new Date(year, 2, firstDay).getDay(); // March = 2
  let dayTime = nightTime + 1;
  hebrewYear.forEach(function (day) {
    nightTime = (nightTime === 7) ?
      0 : nightTime;
    dayTime = (dayTime === 7) ?
      0 : dayTime;
    day.dayName = dayNames[nightTime] + " - " + dayNames[dayTime];
    nightTime += 1;
    dayTime += 1;
  });
};

const getCurrentDay = function ({paganMonths, sunDown, hebrewYear}) {
  const data = arguments[0];
  const now = new Date();
  const month = paganMonths[now.getMonth()].name;
  const day = now.getDate();
  const hours12 = parseHours24(now.getHours());
  const hours = String(hours12.hours);
  const cycle = hours12.cycle;
  const minutes = padOneNumber(now.getMinutes());
  const year = now.getFullYear();
  const theTime = Number(hours + minutes);
  const sunDownHours = sunDown.hours;
  const sunDownMinutes = padOneNumber(sunDown.minutes);
  const sunDownTime = Number(sunDownHours + sunDownMinutes);
  let regexCurrentDate;
  if (cycle === "PM" && theTime >= sunDownTime && theTime < 1200) {
    regexCurrentDate = new RegExp("^" + month + " " + day + " " + year);
  } else {
    regexCurrentDate = new RegExp(month + " " + day + " " + year + "$");
  }
  for (let i = 0; i < hebrewYear.length; i += 1) {
    if (regexCurrentDate.test(hebrewYear[i].date)) {
      data.currentDay = hebrewYear[i];
      return;
    }
  }
};

/* prototype */
Calendar.prototype = newObj();
Calendar.prototype.constructor = Calendar;

Calendar.prototype.changeFirstFruits = function (day) {
  // defaults to Abib 26
  if (day === "19") {
    this.months.Abib.day19.special =
      "Feast of Unleavened Bread 5<br>" +
      "Feast of First Fruits";
    this.months.Abib.day26.special = "none";
    this.months.Sivan.day8.special = "Feast of Weeks";
    this.months.Sivan.day8.sabbath = "yes";
    this.months.Sivan.day15.special = "none";
    this.months.Sivan.day15.sabbath = "no";
  }
};

/* exports */
return Calendar;

});
