MaryManage.define("view/settings", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewSettings(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const parseEquinox = utils.parseEquinox;
const parseSunDown = utils.parseSunDown;
const numberize = utils.numberize;
const freezeEvent = utils.freezeEvent;
const wrap = MaryDom("#MaryCalendar");
const settings = newObj();

/* generation */
const generateSkeleton = function () {
  settings.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .style("display: none")
    .appendTo(wrap);
  settings.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(settings.all);
  settings.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(settings.all);
  settings.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(settings.all);
};

const generateHeader = function () {
  settings.title = MaryDom("<div></div>")
    .class("MaryCalendar_HeaderTitle")
    .addText("Settings")
    .appendTo(settings.header);
};

const generateBodyTabs = function () {
  settings.tabs = MaryDom("<div></div>")
    .class("MaryCalendar_Tabs")
    .appendTo(settings.body)
    .appendChildren(MaryDom("<button>", null, 4))
    .children(0)
    .class("MaryCalendar_TabButton")
    .setText(["Equinox", "Sundown", "First-Fruits", "More"], "spread");
};

const generateBodySections = function () {
  settings.sections = MaryDom("<div></div>", null, 4)
    .class("MaryCalendar_TabSection")
    .style("display: none")
    .appendTo(settings.body);
  generateEquinox(settings.sections.eq(0));
  generateSunDown(settings.sections.eq(1));
  generateFirstFruits(settings.sections.eq(2));
  generateMore(settings.sections.eq(3));
  generateQuestions();
};

const generateEquinox = function (section) {
  let selects, inputs;
  section.setHTML(
    "Active Equinox: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "March <select></select> at <input> : <input> <select></select> <input>"
  );
  selects = MaryDom("select", section)
    .style("width: 4.4em")
    .option(["19", "20", "21"], 0)
    .option(["AM", "PM"], 1);
  inputs = MaryDom("input", section)
    .style(["width: 2.5em", "width: 2.5em", "width: 4em"], "spread")
    .placeholder(["hh", "mm", "yyyy"], "spread");
  settings.equinox = newObj();
  settings.equinox.text = MaryDom("span", section);
  settings.equinox.day = selects.eq(0);
  settings.equinox.hours = inputs.eq(0);
  settings.equinox.minutes = inputs.eq(1);
  settings.equinox.cycle = selects.eq(1);
  settings.equinox.year = inputs.eq(2);
};

const generateSunDown = function (section) {
  let inputs;
  section.setHTML(
    "Active Sundown: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "<input> : <input> PM"
  );
  inputs = MaryDom("input", section)
    .style(["width: 2.5em", "width: 2.5em"], "spread")
    .placeholder(["hh", "mm"], "spread");
  settings.sunDown = newObj();
  settings.sunDown.text = MaryDom("span", section);
  settings.sunDown.hours = inputs.eq(0);
  settings.sunDown.minutes = inputs.eq(1);
};

const generateFirstFruits = function (section) {
  let selects;
  section.setHTML(
    "Active First-Fruits: <span>...</span><br><br>" +
    "<em>Change to:</em><br><br>" +
    "Abib <select></select>"
  );
  selects = MaryDom("select", section)
    .style("width: 4.4em")
    .option(["19", "26"])
    .selectOption("26");
  settings.firstFruits = newObj();
  settings.firstFruits.text = MaryDom("span", section);
  settings.firstFruits.day = selects.eq(0);
};

const generateMore = function (section) {
  let inputs, selects, buttons;
  section.setHTML(
    "<br><div>Create Dedicated Window? <input type='checkbox'></div>" +
    "<div>Hide Seconds on Clock? <input type='checkbox'></div>" +
    "<div>Reset Calendar? <input type='checkbox'></div>" +
    "<div>Change Theme: <select></select></div>" +
    "<div>Change Size: <select></select></div>" +
    "<button>backup</button><button>restore</button>"
  );
  section.find("div")
    .class("MaryCalendar_MoreDiv");
  inputs = MaryDom("input", section);
  selects = MaryDom("select", section)
    .style("width: 6em")
    .option(["Glory", "Sky", "Deep", "Vital", "Pure", "Adam"], 0)
    .option(["276px", "336px", "396px", "456px", "516px"], 1)
    .selectOption(["Sky", "336px"]);
  buttons = MaryDom("button", section)
    .class("MaryCalendar_BackupButton");
  settings.more = newObj();
  settings.more.newWindow = inputs.eq(0);
  settings.more.noSeconds = inputs.eq(1);
  settings.more.reset = inputs.eq(2);
  settings.more.theme = selects.eq(0);
  settings.more.size = selects.eq(1);
  settings.more.backup = buttons.eq(0);
  settings.more.restore = buttons.eq(1);
  settings.more.standAlone = section.find("div").eq([0, 4]);
};

const generateQuestions = function () {
  settings.questions = MaryDom("<button>", null, 3)
    .class("MaryCalendar_Question")
    .setText("?")
    .appendTo(settings.sections, "spread");
  settings.answers = MaryDom("<div></div>", null, 3)
    .class("MaryCalendar_Answer")
    .style("display: none")
    .setText([
      "Sets first day after equinox is observable.",
      "Sets when each day ends and begins.",
      "Sets First Fruits and the Feast of Weeks."
    ], "spread")
    .appendTo(settings.questions, "spread");
};

const generateFooter = function () {
  settings.save = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Save")
    .appendTo(settings.footer);
  settings.cancel = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Cancel")
    .appendTo(settings.footer);
};

/* functions */
const openTabSection = function (index) {
  settings.tabs.removeClass("MaryCalendar_TabButtonSelected");
  settings.tabs.class("MaryCalendar_TabButtonSelected", index);
  settings.sections.style("display: none");
  settings.sections.style("display", index);
};

const getCurrentTabSection = function () {
  const index = settings.sections.findIndex(function (node) {
    return node.style.display !== "none";
  });
  if (index != null) {
    return index;
  } else {
    return 0; // default
  }
};

const closeAnswers = function () {
  settings.answers.style("display: none");
};

const toggleAnswers = function () {
  if (settings.answers.first.style.display === "") {
    settings.answers.style("display: none");
  } else {
    settings.answers.style("display");
  }
};

const handleRestoreFile = function () {
  const hasFile = 
    window.File &&
    window.FileReader &&
    window.FileList &&
    window.Blob;
  const okay = function () {
    const input = MaryDom("input", this).first;
    if (input.files[0]) {
      const file = input.files[0];
      const reader = new window.FileReader();
      reader.onload = function restoring(event) {
        MaryMessage.publish("restore-backup", reader.result);
      };
      reader.readAsText(file);
    } else {
      return modals.Alert("No file was selected. Canceling.");
    }
  };
  if (hasFile) {
    return modals.Confirm(
      "Please select your backup file:<br><br>" +
      "<input type='file' class='MaryCalendar_Restore'></input><br><br>" +
      "and hit ok to proceed. Be aware that any previous notes will be " +
      "written over, so push cancel if you wish to make a backup first.",
      okay
    );
  } else {
    return modals.Alert(
      "I'm sorry, but your browser is not capable of handling " +
      "your backup file directly. I'm afraid your options are " +
      "to input your data manually, or to get a newer browser.<br>:("
    );
  }
};

const getDataForSave = function () {
  return {
    eDay: settings.equinox.day.value(),
    eHours: numberize(settings.equinox.hours.value()),
    eMinutes: numberize(settings.equinox.minutes.value()),
    eCycle: settings.equinox.cycle.value(),
    eYear: numberize(settings.equinox.year.value()),
    sHours: numberize(settings.sunDown.hours.value()),
    sMinutes: numberize(settings.sunDown.minutes.value()),
    firstFruits: settings.firstFruits.day.value(),
    newWindow: settings.more.newWindow.checked(),
    noSeconds: settings.more.noSeconds.checked(),
    reset: settings.more.reset.checked(),
    theme: settings.more.theme.value(),
    size: settings.more.size.value()
  };
};

const getDataForTheme = function () {
  return {
    theme: settings.more.theme.value(),
    size: settings.more.size.value()
  };
};

/* initialize */
generateSkeleton();
generateHeader();
generateBodyTabs();
generateBodySections();
generateFooter();

/* handlers */
settings.tabs.on("click", function (event) {
  openTabSection(this.index);
  freezeEvent(event);
});

settings.more.theme.on("change", function (event) {
  MaryMessage.publish("change-theme", getDataForTheme());
});

settings.more.size.on("change", function (event) {
  MaryMessage.publish("change-theme", getDataForTheme());
});

settings.more.backup.on("click", function (event) {
  MaryMessage.publish("get-backup");
});

settings.more.restore.on("click", function (event) {
  handleRestoreFile();
});

settings.questions.on("click", function (event) {
  toggleAnswers();
  freezeEvent(event);
});

settings.save.on("click", function (event) {
  MaryMessage.publish("save", getDataForSave());
  freezeEvent(event);
});

settings.cancel.on("click", function (event) {
  MaryMessage.publish("switch-view", "main");
  MaryMessage.publish("cancel");
  freezeEvent(event);
});

/* subscriptions */
MaryMessage.subscribe("refresh-equinox", function refreshEquinox({vars}) {
  const equinox = parseEquinox(vars.equinox);
  for (let key in settings.equinox) {
    if (key !== "text") {
      settings.equinox[key].value(equinox[key]);
    }
  }
  settings.equinox.text.setText(vars.equinox);
});

MaryMessage.subscribe("refresh-sundown", function refreshSunDown({vars}) {
  const sunDown = parseSunDown(vars.sunDown);
  for (let key in sunDown) {
    if (key !== "text") {
      settings.sunDown[key].value(sunDown[key]);
    }
  }
  settings.sunDown.text.setText(vars.sunDown + " PM");
});

MaryMessage.subscribe("refresh-fruits", function refreshFruits({vars}) {
  settings.firstFruits.day.value(vars.firstFruits);
  settings.firstFruits.text.setText("Abib " + vars.firstFruits);
});

MaryMessage.subscribe("refresh-more", function refreshMore({vars}) {
  if (vars.noSeconds === "true") {
    settings.more.noSeconds.checked(true);
  } else {
    settings.more.noSeconds.checked(false);
  }
  settings.more.theme.value(vars.theme);
  settings.more.size.value(vars.size);
  MaryMessage.publish("change-theme");
  openTabSection(getCurrentTabSection());
});

MaryMessage.subscribe("download-backup", function backup({filename, text}) {
  const message =
    "MaryCalendar just created a text file with all your notes!!! " +
    "You can use this file to <em>restore</em> them too, but you " +
    "must keep the JSON format and the same day names, okay?<br>";
  const addendum =
    "<br>(Use 'save link as...' in the context menu to download.)";
  const link = MaryDom("<a></a>")
    .class("MaryCalendar_BackupLink")
    .setText("Download")
    .attr([
      "target=_blank",
      "download=" + filename,
      "href=data:text/plain," + encodeURIComponent(text)
    ]);
  if ("download" in link.first) {
    modals.Alert(message + link.getAsHTML());
  } else {
    modals.Alert(message + link.getAsHTML() + addendum);
  }
});

MaryMessage.subscribe("enter-safeMode", function enterSafeMode() {
  MaryMessage.publish("switch-view", "settings");
  MaryMessage.publish("change-theme");
  openTabSection(getCurrentTabSection());
  settings.cancel.style("display: none");
  settings.tabs.filter(function getExtraTabs(node, index) {
    return index >= 2;
  }, function hideExtraTabs(node, index) {
    settings.tabs.style("display: none", index);
  });
  modals.Alert(
    "Please input an equinox and sundown time, then save.<br><br>" +
    "If cookies are enabled I can remember your settings."
  );
});

MaryMessage.subscribe("exit-safeMode", function exitSafeMode() {
  settings.cancel.style("display");
  settings.tabs.style("display");
  MaryMessage.publish("initialize");
});

MaryMessage.subscribe("auto-save", function autoSave() {
  settings.save.first.click();
});

MaryMessage.subscribe("disable-stand-alone", function disableStandAlone() {
  settings.more.standAlone.remove();
});

/* exports */
return settings;
  
}, true);
