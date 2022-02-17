//+++---Control---+++//
MaryManage.define("control/main", [
  "utils",
  "MaryMessage",
  "model/vars",
  "view/modals"
], function controlMain(utils, MaryMessage, vars, modals, require) {

/* constants */
const newObj = utils.newObj;
const padOneNumber = utils.padOneNumber;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const parseHours24 = utils.parseHours24;

/* variables */
let model, today, clock, didSaveMessage;

/* functions */
const getCalendar = function () {
  model = require("model/calendar")(vars.equinox, vars.sunDown);
  model.changeFirstFruits(vars.firstFruits);
  today = model.currentDay;
};

const selectedMonthIndex = function () {
  let result;
  model.months.forEach(function (month, index) {
    if (month.name === vars.selectedMonth) {
      result = index;
    }
  });
  return result;
};

const varsCheck = function () {
  if (vars.result === null) {
    return modals.Alert(
      "Unblessedly, your browser is currently unable to save any " +
      "settings data or any of your daily notes data. This can be " +
      "resolved by enabling cookies and by using an HTML5 Local " +
      "Storage compliant browser. Otherwise, all data will be " +
      "lost on each refresh of the page. :("
    );
  } else if (vars.result === "cookies") {
    MaryMessage.publish("disable-notes");
    return modals.Alert(
      "Unblessedly, your browser is not HTML5 Local Storage compliant. " +
      "However, don't worry, you can still save your settings data. " +
      "But daily note taking has been disabled due to size constraints. " +
      "You can try to update your browser or switch to any of the " +
      "more modern ones if you want to add notes to the calendar.<br><br>" +
      "If you notice that the calendar is still not saving, go into your " +
      "browser settings and make sure '3rd Party Cookies' are allowed, " +
      "else all data will be lost on each refresh of the page. :("
    );
  } else {
    return true;
  }
};

const ifSunDown = function (hours, minutes, seconds, cycle) {
  const sunDown = parseSunDown(vars.sunDown);
  const sunDownTime = sunDown.hours + sunDown.minutes;
  const theTime = String(hours) + padOneNumber(minutes);
  if (cycle === "PM" && theTime === sunDownTime && seconds <= 1) {
    MaryMessage.publish("refresh");
    MaryMessage.publish("current-month");
    MaryMessage.publish("alarm");
  }
};

/* save functions */
const saveReset = ({reset}) => {
  if (reset) {
    vars.clearAll();
    modals.Alert(
      "If you refresh now, you will get the default settings.<br>" +
      "Else if you close the window, all data will be deleted.<br>" +
      "You can also un-check reset and re-save to keep your settings."
    );
    return true;
  }
};

const saveError = ({eHours, eMinutes, eYear, sHours, sMinutes}) => {
  const ehoursError = "Hours needs to be a number from 1 to 12.";
  const sHoursError = "Hours needs to be a number from 4 to 9.";
  const minutesError = "Minutes needs to be a number from 0 to 59.";
  const yearError = "Year must be any number above 0.";
  let errorMessage = "";
  if ((eHours >= 1 && eHours <= 12) === false) {
    errorMessage += "Equinox " + ehoursError + "<br><br>";
  }
  if ((eMinutes >= 0 && eMinutes <= 59) === false) {
    errorMessage += "Equinox " + minutesError + "<br><br>";
  }
  if ((eYear >= 1) === false) {
    errorMessage += "Equinox " + yearError + "<br><br>";
  }
  if ((sHours >= 4 && sHours <= 9) === false) {
    errorMessage += "Sundown " + sHoursError + "<br><br>";
  }
  if ((sMinutes >= 0 && sMinutes <= 59) === false) {
    errorMessage += "Sundown " + minutesError + "<br><br>";
  }
  if (errorMessage === "") {
    return false;
  } else {
    modals.Alert(errorMessage);
    return true;
  }
};

const saveVars = (data) => {
  vars.equinox = "March " +
    data.eDay + " " +
    data.eHours + ":" +
    padOneNumber(data.eMinutes) + " " +
    data.eCycle + " " +
    data.eYear;
  vars.sunDown = data.sHours + ":" +
    padOneNumber(data.sMinutes);
  vars.firstFruits = data.firstFruits;
  vars.theme = data.theme;
  vars.size = data.size || vars.size; // || for size-override
  vars.noSeconds = String(data.noSeconds);
};

const saveSafeMode = () => {
  if (vars.safeMode === "on") {
    vars.safeMode = null;
    vars.save();
    MaryMessage.publish("exit-safeMode");
  } else {
    vars.save();
    MaryMessage.publish("refresh");
  }
};

const saveNewWindow = ({newWindow, size}) => {
  if (newWindow) {
    MaryMessage.publish("new-window", {size});
  }
};

const saveIsDisabled = function () {
  if (!didSaveMessage && vars.result === "disabled") {
    modals.Alert(
      "Saving has been disabled in MaryCalendar. This means that your " +
      "settings will only be remembered as long as the page isn't " +
      "refreshed. To enable saving, go into MaryCalendar.js and set the " +
      "'config' property called 'disableSaving' to 'false'. Thanks! :)"
    );
    didSaveMessage = true;
  }
};

/* subscriptions */
MaryMessage.subscribe("override-initial-size", function ({size}) {
  // this happens before initialize
  vars.size = size;
});

MaryMessage.subscribe("initialize", function init() {
  getCalendar();
  MaryMessage.publish("initialize-view");
  MaryMessage.publish("start-time");
  if (vars.firstTime === true) {
    MaryMessage.publish("current-month");
  } else {
    MaryMessage.publish("change-month");
  }
  MaryMessage.publish("alarm");
  setTimeout(varsCheck, 500);
});

MaryMessage.subscribe("initialize-view", function initView () {
  MaryMessage.publish("set-month-jump", {
    months: model.months.map(function (month) {
      return month.name;
    })
  });
  MaryMessage.publish("refresh-settings");
});

MaryMessage.subscribe("change-month", function changeMonth() {
  const data = newObj();
  data.month = model.months[vars.selectedMonth];
  data.today = today;
  data.vars = vars;
  data.alarm = vars.alarm;
  MaryMessage.publish("change-title", data);
  MaryMessage.publish("hide-extra-days", data);
  MaryMessage.publish("change-days", data);
  MaryMessage.publish("set-current-day", data);
  MaryMessage.publish("change-popups", data);
  MaryMessage.publish("change-now", data);
  MaryMessage.publish("load-notes", data);
  MaryMessage.publish("load-alarm", data);
});

MaryMessage.subscribe("refresh-settings", function refreshSettings() {
  const data = newObj();
  data.vars = vars;
  MaryMessage.publish("refresh-equinox", data);
  MaryMessage.publish("refresh-sundown", data);
  MaryMessage.publish("refresh-fruits", data);
  MaryMessage.publish("refresh-more", data);
});

MaryMessage.subscribe("change-theme", function ({theme, size} = {}) {
  MaryMessage.publish("generate-css", {
    theme: theme || vars.theme,
    size: size || vars.size
  });
});

MaryMessage.subscribe("previous-month", function goToPreviousMonth() {
  let index = selectedMonthIndex();
  index = (index - 1 >= 0) ?
    index - 1 : 0;
  vars.selectedMonth = model.months[index].name;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("next-month", function goToNextMonth() {
  let index = selectedMonthIndex();
  index = (index + 1 < model.months.length) ?
    index + 1 : model.months.length - 1;
  vars.selectedMonth = model.months[index].name;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("current-month", function goToCurrentMonth() {
  if (today) {
    vars.selectedMonth = today.month;
    vars.save();
    MaryMessage.publish("change-month");
  } else {
    MaryMessage.publish("change-month");
  }
});

MaryMessage.subscribe("jump-month", function jumpMonth({month}) {
  vars.selectedMonth = month;
  vars.save();
  MaryMessage.publish("change-month");
});

MaryMessage.subscribe("get-backup", function downloadBackup() {
  const notes = newObj();
  for (let key in vars) {
    if (/\d$/.test(key)) {
      notes[key] = vars[key];
    }
  }
  MaryMessage.publish("download-backup", {
    filename: "MaryCalendar - Backup Notes " +
      vars.equinox.match(/\d+$/)[0] + ".txt",
    text: JSON.stringify(notes, null, "  ")
      .replace(/\n/g, "\n\n")
  });
});

MaryMessage.subscribe("restore-backup", function restoreBackup(data) {
  const months = model.months.map(function (month) {
    return month.name;
  }).join("|");
  const regexMonths = new RegExp("(" + months + ")\\d+");
  let notes;
  try {
    notes = JSON.parse(data);
  } catch (error) {
    return modals.Alert(
      "Couldn't parse the backup file into JSON. Canceling. " +
      "You can edit the backup file in a text editor to make " +
      "it JSON compatible."
    );
  }
  for (let key in notes) {
    if (!regexMonths.test(key)) {
      return modals.Alert(
        "At least one day name in the backup doesn't have the " +
        "right syntax. Day names must follow this pattern: " +
        "'Abib1', 'Abib2'...'Adar32', etc. Please modify the file " +
        "and try again. No notes have been added or changed yet. :)"
      );
    }
    if (notes[key].length > 3000) {
      return modals.Alert(
        "The length of the note for " + key + " is too long. :(<br>" +
        "Current: " + notes[key].length + " characters.<br>" +
        "Expected: 3000 characters or less.<br>" +
        "Please correct this in any text editor and try again.<br>" +
        "No notes have been added or changed yet. Thank you! :)"
      );
    }
  }
  for (let key in notes) {
    vars[key] = notes[key];
  }
  vars.save();
  MaryMessage.publish("auto-save");
  setTimeout(function () {
    modals.Alert(
      "Notes have been successfully restored from the backup! <br><br>" +
      "Praise be to Yahweh through Yahshua Messiah! Amen. :)"
    );
  }, 100);
});

MaryMessage.subscribe("save", function save(data) {
  if (saveReset(data) === true) {
    return;
  }
  if (saveError(data) !== false) {
    return;
  }
  saveVars(data);
  saveSafeMode(data);
  saveNewWindow(data);
  MaryMessage.publish("stop-time");
  MaryMessage.publish("start-time");
  MaryMessage.publish("switch-view", "main");
  saveIsDisabled();
});

MaryMessage.subscribe("refresh", function refresh() {
  getCalendar();
  MaryMessage.publish("change-month");
  MaryMessage.publish("refresh-settings");
});

MaryMessage.subscribe("cancel", function onCancel() {
  MaryMessage.publish("refresh");
});

MaryMessage.subscribe("start-time", function refresh() {
  const seconds = () => now.getSeconds();
  const minutes = () => now.getMinutes();
  const hours = function () {
    var hours24 = now.getHours();
    var hours12 = parseHours24(hours24);
    cycle = hours12.cycle;
    return hours12.hours;
  };
  let now, cycle;
  clock = setInterval(function () {
    now = new Date();
    if (vars.noSeconds === "true") {
      MaryMessage.publish("change-time", {
        time: hours() + ":" +
          padOneNumber(minutes()) + " " +
          cycle
      });
    } else {
      MaryMessage.publish("change-time", {
        time: hours() + ":" +
          padOneNumber(minutes()) + ":" +
          padOneNumber(seconds()) + " " +
          cycle
      });
    }
    if (vars.safeMode !== "on") {
      ifSunDown(hours(), minutes(), seconds(), cycle);
    }
  }, 1000);
});

MaryMessage.subscribe("stop-time", function refresh() {
  clearInterval(clock);
});

MaryMessage.subscribe("save-note", function saveNote(data) {
  let key, note;
  data = data.split(":");
  key = data[0];
  note = data[1];
  if (note.length > 3000) {
    return modals.Alert(
      "The length of the note is too long. :(<br>" +
      "Current: " + note.length + " characters.<br>" +
      "Expected: 3000 characters or less.<br>" +
      "Your note has not been saved and will not appear on a refresh. " +
      "But you may keep it in memory, edit it, and " +
      "try to save it again if you like! Thank you!"
    );
  }
  if (note === "") {
    delete vars[key];
    vars.clear(key);
  } else {
    vars[key] = note;
    vars.save();
  }
});

MaryMessage.subscribe("save-alarm", function saveAlarm(data) {
  if (data.day == null) {
    delete vars.alarm;
    vars.clear("alarm");
  } else {
    vars.alarm = vars.selectedMonth + data.day;
  }
  vars.save();
});

MaryMessage.subscribe("alarm", function alarm() {
  let month, day, note;
  if (today && vars.alarm) { // if in the current year and an alarm is set
    month = vars.alarm.match(/\D+/)[0];
    day = vars.alarm.match(/\d+/)[0];
    note = vars[vars.alarm];
  } else {
    return;
  }
  if (month !== today.month || day !== today.day) {
    return;
  }
  if (note == null) {
    note = "";
  }
  MaryMessage.publish("current-month");
  MaryMessage.publish("remove-alarm", {
    index: Number(day) - 1
  });
  setTimeout(function () {
    modals.Alert(
      // perhaps make this part a function in model?
      today.month + " " + today.day + "<br>" +
      today.dayName + "<br>" +
      today.date + "<br><br>" +
      note
    );
  }, 100);
});

/* exports */
return true;
  
}, true);
