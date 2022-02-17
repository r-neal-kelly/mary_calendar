MaryManage.define("view/main", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewMain(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const bubbleCheck = utils.bubbleCheck;
const isStandAlone = utils.isStandAlone();
const wrap = MaryDom("#MaryCalendar");
const main = newObj();
const doc = document;

/* generation */
const revealTitle = function () {
  if (isStandAlone) {
    MaryDom(".MaryCalendarH1")
      .style("display");
  }
};

const generateSkeleton = function () {
  main.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .appendTo(wrap);
  main.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(main.all);
  main.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(main.all);
  main.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(main.all);
};

const generateHeader = function () {
  main.previousMonth = MaryDom("<button>")
    .class("MaryCalendar_HeaderPrevious")
    .addText("<<")
    .appendTo(main.header);
  main.monthTitle = MaryDom("<button>")
    .class("MaryCalendar_HeaderTitle")
    .addText("...")
    .appendTo(main.header);
  main.nextMonth = MaryDom("<button>")
    .class("MaryCalendar_HeaderNext")
    .addText(">>")
    .appendTo(main.header);
};

const generateMonthJump = function () {
  main.monthJump = MaryDom("<div></div>")
    .class("MaryCalendar_MonthJump")
    .style("display: none;")
    .appendTo(main.body);
  main.monthJumpButtons = MaryDom("<button>", main.body, 12)
    .class("MaryCalendar_GeneralButton")
    .addHTML("<span>")
    .appendTo(main.monthJump);
};

const generateRows = function () {
  main.rows = MaryDom("<div></div>", main.body, 5)
    .class("MaryCalendar_Row")
    .appendTo(main.body)
    .forEach(function (row) {
      MaryDom("<button>", row, 7)
        .class("MaryCalendar_RowButton")
        .appendTo(row);
      MaryDom("<div></div>", row, 7)
        .class("MaryCalendar_RowPopup")
        .style("display: none;")
        .appendTo(row);
      MaryDom("<div></div>", row, 7)
        .class("MaryCalendar_RowNote")
        .style("display: none;")
        .setText("Notes:")
        .appendTo(row);
    });
  main.days = MaryDom(".MaryCalendar_RowButton", main.body);
  main.popups = MaryDom(".MaryCalendar_RowPopup", main.body);
  main.notes = MaryDom(".MaryCalendar_RowNote", main.body);
};

const generateDays = function () {
  main.days.addHTML("<span></span><div>†</div><div>●</div>")
    .find("div")
      .class([
        "MaryCalendar_NoteIndicator",
        "MaryCalendar_AlarmIndicator"
      ], "checker")
      .style("display: none");
};

const generatePopups = function () {
  main.popups.forEach(function (popup) {
    MaryDom("<div></div>", popup, 5)
      .class("MaryCalendar_SpecialPopUp", 3)
      .class("MaryCalendar_SabbathPopUp", 4)
      .appendTo(popup);
    MaryDom("<button>note</button>")
      .class("MaryCalendar_NoteButtonRight")
      .appendTo(popup);
    MaryDom("<button>alarm</button>")
      .class("MaryCalendar_NoteButtonLeft")
      .appendTo(popup);
  });
  main.noteButtons = MaryDom(".MaryCalendar_NoteButtonRight", main.body);
  main.alarmButtons = MaryDom(".MaryCalendar_NoteButtonLeft", main.body);
};

const generateNotes = function () {
  main.notes.edit = MaryDom();
  main.notes.clear = MaryDom();
  main.notes.cancel = MaryDom();
  main.notes.save = MaryDom();
  main.notes.addHTML(
    "<div class='MaryCalendar_NoteText'></div>" +
    "<textarea class='MaryCalendar_NoteInput'></textarea>" +
    "<button class='MaryCalendar_NoteButtonLeft'>edit</button>" +
    "<button class='MaryCalendar_NoteButtonRight'>clear</button>" +
    "<button class='MaryCalendar_NoteButtonLeft'>cancel</button>" +
    "<button class='MaryCalendar_NoteButtonRight'>save</button>"
  )
    .children()
    .filter("button", function posCall(button) {
      if (/edit/.test(button.textContent)) {
        main.notes.edit = main.notes.edit.add(button);
      } else if (/clear/.test(button.textContent)) {
        main.notes.clear = main.notes.clear.add(button);
      } else if (/cancel/.test(button.textContent)) {
        main.notes.cancel = main.notes.cancel.add(button);
      } else {
        main.notes.save = main.notes.save.add(button);
      }
    });
  main.notes.text = MaryDom(".MaryCalendar_NoteText", main.body);
  main.notes.input = MaryDom(".MaryCalendar_NoteInput", main.body)
    .placeholder("type a note")
    .style("display: none");
  main.notes.cancel.style("display: none");
  main.notes.save.style("display: none");
};

const generateTime = function () {
  main.time = MaryDom("<div><div></div></div>")
    .class("MaryCalendar_Time")
    .appendTo(main.body)
    .firstChildren(0);
};

const generateFooter = function () {
  main.licenseButton = MaryDom("<button>")
    .class("MaryCalendar_LicenseButton")
    .addText("L")
    .appendTo(main.footer);
  main.now = MaryDom("<button>")
    .class("MaryCalendar_Now")
    .appendTo(main.footer);
  main.settingsButton = MaryDom("<button>")
    .class("MaryCalendar_SettingsButton")
    .addText("S")
    .appendTo(main.footer);
};

const hideDisabled = function () {
  if (config.disableSettings === true) {
    main.settingsButton.remove();
  }
  if (config.disableNotes === true) {
    main.notes.remove();
    main.noteButtons.remove();
  }
  if (config.disableAlarm === true) {
    main.alarmButtons.remove();
  }
};

/* checks */
const isCurrentYear = function () {
  if (/\d/.test(main.now.getText())) {
    return true;
  } else {
    return false;
  }
};

const isCurrentDay = function (index) {
  const day = main.days.eq(index).first;
  if (/Current/.test(day.classList.value)) {
    return true;
  } else {
    return false;
  }
};

const checkTarget = function (target) {
  return bubbleCheck(target, [
    "MaryCalendar_Modal",
    "MaryCalendar_RowPopup",
    "MaryCalendar_RowNote"
  ]);
};

/* toggles */
const closeMonthJump = function () {
  main.monthJump.style("display: none");
};

const closeAllPopups = function () {
  main.days.removeClass("MaryCalendar_RowButtonSelected");
  main.popups.style("display: none");
};

const closeAllNotes = function () {
  main.notes.style("display: none");
  noteCancel();
};

const closeAll = function (exception) {
  closeMonthJump();
  closeAllPopups();
  closeAllNotes();
};

const toggleMonthJump = function () {
  if (main.monthJump.getStyle("display") === "none") {
    main.monthJump.style("display");
  } else {
    main.monthJump.style("display: none");
  }
};

const togglePopup = function (index) {
  toggle(index, "popups");
};

const toggleNote = function (index) {
  toggle(index, "notes");
};

const toggle = function (index, type) {
  if (main[type].getStyle("display", index) === "none") {
    main.days.removeClass("MaryCalendar_RowButtonSelected");
    main[type].style("display: none");
    main.days.class("MaryCalendar_RowButtonSelected", index);
    main[type].style("display", index);
  } else {
    main.days.removeClass("MaryCalendar_RowButtonSelected");
    main[type].style("display: none");
  }
};

const toggleAlarm = function (index) {
  const alarm = main.days.eq(index)
    .find(".MaryCalendar_AlarmIndicator");
  let day;
  if (!isCurrentYear()) {
    return modals.Alert(
      "I'm sorry, it doesn't make sense to set the alarm for this year. " +
      "That's because the alarm only goes off during the current year. " +
      "Try setting it for another year! :)"
    );
  }
  if (isCurrentDay(index)) {
    return modals.Alert(
      "I'm sorry, it doesn't make sense to set the alarm for today. " +
      "That's because the alarm only goes off for the current day. " +
      "Try setting it for another day! :)"
    );
  }
  if (alarm.getStyle("display") === "") {
    alarm.style("display: none");
    day = null;
  } else {
    main.days.find(".MaryCalendar_AlarmIndicator")
      .style("display: none");
    alarm.style("display");
    day = index + 1;
  }
  MaryMessage.publish("save-alarm", {
    day: day
  });
};

const clearAlarm = function () {
  main.days.find(".MaryCalendar_AlarmIndicator")
    .style("display: none");
  MaryMessage.publish("save-alarm", {
    day: null
  });
};

/* notes */
const noteFromPopup = function (index) {
  setTimeout(function () {
    closeAllPopups();
    toggleNote(index);
  }, 200);
};

let noteEditFromPopup = function (index) {
  noteFromPopup(index);
  noteEdit(index);
};

const noteEdit = function (index) {
  main.notes.text.style("display: none", index);
  main.notes.input.eq(index).style("display");
  main.notes.edit.style("display: none", index);
  main.notes.clear.style("display: none", index);
  main.notes.cancel.style("display", index);
  main.notes.save.style("display", index);
  setTimeout(function () {
    main.notes.input.eq(index).first.focus();
  }, 100);
};

const noteClear = function (index) {
  main.notes.text.eq(index)
    .style("display")
    .setText("");
  main.notes.input.eq(index)
    .style("display: none")
    .value("");
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
  main.days.eq(index).find(".MaryCalendar_NoteIndicator")
    .style("display: none");
  MaryMessage.publish(
    "save-note",
    main.monthTitle.getText() + (index + 1) + ":" + ""
  );
};

const noteCancel = function (index) {
  main.notes.text.style("display", index);
  main.notes.input.style("display: none", index);
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
};

let noteSave = function (index) {
  const note = main.notes.input.eq(index)
    .value();
  main.notes.text.eq(index)
    .style("display")
    .setText(note); // make sure to keep as text, not HTML
  main.notes.input.style("display: none", index);
  main.notes.edit.style("display", index);
  main.notes.clear.style("display", index);
  main.notes.cancel.style("display: none", index);
  main.notes.save.style("display: none", index);
  if (note === "") {
    main.days.eq(index).find(".MaryCalendar_NoteIndicator")
      .style("display: none");
  } else {
    main.days.eq(index).find(".MaryCalendar_NoteIndicator")
      .style("display");
  }
  MaryMessage.publish(
    "save-note",
    main.monthTitle.getText() + (index + 1) + ":" + note
  );
};

const noteSaveOnEnter = function (event, index) {
  if (event.keyCode === 13) { // enter, return
    noteSave(index);
    event.preventDefault();
  }
};

const noteConfirmClear = function (index) {
  modals.Confirm(
    "Sure?",
    function okayThen() {
      noteClear(index);
    }
  );
};

/* initialize */
revealTitle();
generateSkeleton();
generateHeader();
generateMonthJump();
generateRows();
generateDays();
generatePopups();
generateNotes();
generateTime();
generateFooter();
hideDisabled();

/* handlers */
main.previousMonth.on("click", function (event) {
  closeAll();
  MaryMessage.publish("previous-month");
  freezeEvent(event);
});

main.nextMonth.on("click", function (event) {
  closeAll();
  MaryMessage.publish("next-month");
  freezeEvent(event);
});

main.monthTitle.on("click", function (event) {
  closeAllPopups();
  closeAllNotes();
  toggleMonthJump();
  freezeEvent(event);
});

main.monthJumpButtons.on("click", function (event) {
  closeAll();
  MaryMessage.publish("jump-month", {
    month: this.node.textContent
  });
  freezeEvent(event);
});

main.now.on("click", function (event) {
  closeAll();
  MaryMessage.publish("current-month");
  freezeEvent(event);
});

main.days.on("click", function (event) {
  closeMonthJump();
  closeAllNotes();
  togglePopup(this.index);
  freezeEvent(event);
});

main.days.on("dblclick", function (event) {
  closeMonthJump();
  closeAllPopups();
  toggleNote(this.index);
  freezeEvent(event);
});

main.alarmButtons.on("click", function (event) {
  toggleAlarm(this.index);
  freezeEvent(event);
});

main.noteButtons.on("click", function (event) {
  noteFromPopup(this.index);
  freezeEvent(event);
});

main.noteButtons.on("dblclick", function (event) {
  noteEditFromPopup(this.index);
  freezeEvent(event);
});

main.notes.text.on("dblclick", function (event) {
  noteEdit(this.index);
  freezeEvent(event);
});

main.notes.input.on("keypress", function (event) {
  noteSaveOnEnter(event, this.index);
  event.stopPropagation();
});

main.notes.edit.on("click", function (event) {
  noteEdit(this.index);
  freezeEvent(event);
});

main.notes.clear.on("click", function (event) {
  noteConfirmClear(this.index);
  freezeEvent(event);
});

main.notes.cancel.on("click", function (event) {
  noteCancel(this.index);
  freezeEvent(event);
});

main.notes.save.on("click", function (event) {
  noteSave(this.index);
  freezeEvent(event);
});

main.settingsButton.on("click", function (event) {
  MaryMessage.publish("switch-view", "settings");
  freezeEvent(event);
});

main.licenseButton.on("click", function (event) {
  MaryMessage.publish("switch-view", "license");
  freezeEvent(event);
});

MaryDom(doc).on("click", function closePopups(event) {
  if (checkTarget(event.target)) {
    return;
  }
  closeAll();
});

/* subscriptions */
MaryMessage.subscribe("set-month-jump", function setMonthJump({months}) {
  main.monthJumpButtons.setText(months, "spread");
});

MaryMessage.subscribe("change-title", function changeTitle({month}) {
  main.monthTitle.setText(month.name);
});

MaryMessage.subscribe("hide-extra-days", function hideExtra({month}) {
  const totalDays = month.totalDays - 1;
  main.days.filter(function limit(day, index) {
    return index > totalDays;
  }, function hide(day) {
    MaryDom(day).style(["z-index: -1", "font-size: 0"]);
  }, function show(day) {
    MaryDom(day).style(["z-index", "font-size"]);
  });
});

MaryMessage.subscribe("change-days", function changeDays({month}) {
  const totalDays = month.totalDays - 1;
  main.days.filter(function limit(day, index) {
    return index <= totalDays;
  }).wrapEach(function changeDay(day, index) {
    const dayNumber = index + 1;
    const dataDay = month["day" + dayNumber];
    day.defaultClass().find("span").setText(dayNumber);
    if (dataDay.special !== "none") {
      day.class("MaryCalendar_DaySpecial");
    } else if (dataDay.sabbath === "yes") {
      day.class("MaryCalendar_DaySabbath");
    } else {
      day.class("MaryCalendar_DayRegular");
    }
  });
});

MaryMessage.subscribe("set-current-day", function setToday({vars, today}) {
  let day;
  if (!today || (vars.selectedMonth !== today.month)) {
    return;
  }
  day = main.days.eq(today.day - 1);
  if (today.special !== "none") {
    day.class("MaryCalendar_CurrentDaySpecial");
  } else if (today.sabbath === "yes") {
    day.class("MaryCalendar_CurrentDaySabbath");
   } else {
    day.class("MaryCalendar_CurrentDayRegular");
  }
});

MaryMessage.subscribe("change-popups", function changePopups({month}) {
  const totalDays = month.totalDays - 1;
  main.popups.filter(function limit(day, index) {
    return index <= totalDays;
  }).wrapEach(function changePopup(popup, index) {
    const dayNumber = index + 1;
    const dataDay = month["day" + dayNumber];
    const children = popup.children();
    const special = (dataDay.special !== "none") ? dataDay.special : "";
    const sabbath = (dataDay.sabbath !== "no") ? "Sabbath" : "";
    children.eq(0).setText(dataDay.month + " " + dataDay.day);
    children.eq(1).setText(dataDay.dayName);
    children.eq(2).setText(dataDay.date);
    children.eq(3).setHTML(special);
    children.eq(4).setText(sabbath);
  });
});

MaryMessage.subscribe("change-now", function changeNow({today}) {
  if (today) {
    main.now.setHTML(
      today.month + " " + today.day + "<br>" +
      today.dayName + "<br>" +
      today.date
    );
  } else {
    main.now.setText("The current day is not in this year.");
  }
});

MaryMessage.subscribe("load-notes", function loadNotes({month, vars}) {
  const notes = [];
  for (let i = 1; i <= 35; i += 1) {
    notes.push(vars[month.name + i]);
  }
  notes.forEach(function (note, index, array) {
    if (note == null) {
      array[index] = "";
    }
  });
  main.notes.text.setText(notes, "spread"); // keep as text, not HTML
  main.notes.input.value(notes, "spread");
  main.days.forEach(function (button, index) {
    if (notes[index] !== "") {
      main.days.eq(index)
        .find(".MaryCalendar_NoteIndicator")
          .style("display");
    } else {
      main.days.eq(index)
        .find(".MaryCalendar_NoteIndicator")
          .style("display: none");
    }
  });
});

MaryMessage.subscribe("load-alarm", function loadAlarm({alarm}) {
  let month, index, indicator;
  if (alarm) {
    month = alarm.match(/\D+/)[0];
    index = Number(alarm.match(/\d+/)[0]) - 1;
  } else {
    return;
  }
  indicator = main.days
    .eq(index)
    .find(".MaryCalendar_AlarmIndicator");
  if (isCurrentYear() && main.monthTitle.getText() === month) {
    indicator.style("display");
  } else {
    indicator.style("display: none");
  }
});

MaryMessage.subscribe("change-time", function changeTime({time}) {
  main.time.setText(time);
});

MaryMessage.subscribe("remove-alarm", function removeAlarm() {
  clearAlarm();
});

MaryMessage.subscribe("switch-view", function switchView() {
  closeAllPopups();
});

MaryMessage.subscribe("disable-notes", function disableNotes() {
  noteEditFromPopup = function () {
    modals.Alert(
      "Sorry, note taking is disabled when there is no HTML5 local " +
      "storage facility. Browsers tend not to allow the amount of " +
      "space required to save a note within a cookie. :("
    );
  };
  noteSave = () => {};
  main.notes.remove();
});

/* exports */
return main;
  
}, true);
