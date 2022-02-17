//+++---Models---+++//
MaryManage.define("model/vars", [
  "utils"
], function modelVars(utils, require) {

/* constants */
const newObj = utils.newObj;
const vars = newObj();
const doc = document;

/* props */
const defineProps = function () {
  Object.defineProperty(vars, "save", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "clear", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "clearAll", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "safeMode", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "firstTime", {
    writable: true,
    enumerable: false
  });
  Object.defineProperty(vars, "result", {
    writable: true,
    enumerable: false
  });
};

/* tests */
const storageCheck = (function tryStorage() {
  try {
    localStorage.setItem("MaryCalendar_Storage", "Works?");
    localStorage.removeItem("MaryCalendar_Storage");
    return true;
  } catch (error) {
    return false;
  }
}());

const cookieCheck = (function tryCookie() {
  let result;
  try {
    doc.cookie = "MaryCalendar_Cookie=non-GMO?; path=/;";
    result = /MaryCalendar_Cookie=non-GMO/.test(doc.cookie);
    doc.cookie = "MaryCalendar_Cookie=; expires=Thu 01 Jan 1970; path=/;";
    return result;
  } catch (error) {
    return false;
  }
}());

/* deserializing */
const deserialize = function () {
  if (storageCheck && localStorage.getItem("MaryCalendar_equinox")) {
    getStorage();
    vars.firstTime = false;
  } else if (cookieCheck && /MaryCalendar_equinox/.test(doc.cookie)) {
    getCookies();
    vars.firstTime = false;
  } else {
    getDefault();
    vars.firstTime = true;
  }
};

const getStorage = function () {
  for (let key in localStorage) {
    if (/MaryCalendar_/.test(key)) {
      vars[key.replace("MaryCalendar_", "")] = localStorage[key];
    }
  }
};

const getCookies = function () {
  const cookies = doc.cookie.match(/MaryCalendar_[^=]*=[^;]*/g);
  for (let cookie of cookies) {
    const key = cookie.match(/[^=]+/)[0]
      .replace("MaryCalendar_", "")
      .trim();
    const value = cookie.match(/=[^=]+/)[0]
      .replace("=", "")
      .trim();
    vars[key] = value;
  }
};

const getDefault = function () {
  setEquinox();
  vars.sunDown = "7:00";
  vars.selectedMonth = "Abib";
  vars.firstFruits = "26";
  vars.size = "336px";
  vars.theme = getTheme();
  vars.noSeconds = getNoSeconds();
};

const setEquinox = function () {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  const defaultEquinoxes = config.defaultEquinoxes;
  if (
    (currentMonth === 2 && currentDate <= 20 || currentMonth < 2) &&
    defaultEquinoxes[currentYear - 1]
  ) {
    vars.equinox = defaultEquinoxes[currentYear - 1];
  } else if (defaultEquinoxes[currentYear]) {
    vars.equinox = defaultEquinoxes[currentYear];
  } else {
    vars.safeMode = "on";
  }
};

const getTheme = function () {
  if (/^(Glory|Sky|Deep|Vital|Pure|Adam)$/.test(config.defaultTheme)) {
    return config.defaultTheme;
  } else {
    return "Sky";
  }
};

const getNoSeconds = function () {
  if (/^(false|true)$/.test(config.defaultNoSeconds)) {
    return String(config.defaultNoSeconds);
  } else {
    return "false";
  }
};

/* serializing */
const getSerializers = function () {
  if (config.disableSaving === true) {
    vars.save = disabled;
    vars.clear = disabled;
    vars.clearAll = clearAll;
    vars.result = "disabled";
    return;
  } else if (storageCheck) {
    vars.save = setStorage;
    vars.clear = clearStorage;
    vars.clearAll = clearAll;
    vars.result = "storage";
  } else if (cookieCheck) {
    vars.save = setCookies;
    vars.clear = clearCookies;
    vars.clearAll = clearAll;
    vars.result = "cookies";
  } else {
    vars.save = disabled;
    vars.clear = disabled;
    vars.clearAll = disabled;
    vars.result = null;
    return;
  }
};

const disabled = () => false;

const setStorage = function () {
  for (let key in this) {
    localStorage.setItem("MaryCalendar_" + key, this[key]);
  }
};

const setCookies = function () {
  const cookies = [];
  for (let key in this) {
    cookies.push("MaryCalendar_" + key + "=" + this[key]);
  }
  for (let cookie of cookies) {
    doc.cookie = cookie + "; path=/;";
  }
};

const clearStorage = function (key) {
  if (localStorage.length === 0) {
    return;
  }
  if (key) {
    localStorage.removeItem("MaryCalendar_" + key);
  } else {
    for (let key in localStorage) {
      if (/MaryCalendar_/.test(key)) {
        localStorage.removeItem(key);
      }
    }
  }
};

const clearCookies = function (key) {
  let cookies;
  if (!/MaryCalendar_/.test(doc.cookie)) {
    return;
  }
  if (key) {
    doc.cookie = "MaryCalendar_" + key.trim() + "=" +
      "; expires=Thu 01 Jan 1970; path=/;";
  } else {
    cookies = doc.cookie.match(/MaryCalendar_[^=]*=/g);
    for (let cookie of cookies) {
      doc.cookie = cookie.trim() +
        "; expires=Thu 01 Jan 1970; path=/;";
    }
  }
};

const clearAll = function () {
  if (storageCheck) {
    clearStorage.call(this);
  }
  if (cookieCheck) {
    clearCookies.call(this);
  }
};

/* initialize */
defineProps();
deserialize();
getSerializers();

/* exports */
return vars;

}, true);
