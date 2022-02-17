//+++---Version---+++//
const MaryCalendarVersion = "v1.0.0";

//+++---Config---+++//
const config = {
  disableSaving: false,
  disableSettings: false,
  disableNotes: false,
  disableAlarm: false,
  defaultNoSeconds: false,
  defaultTheme: "Sky",
  defaultEquinoxes: {
    // these are UTC + 02:00, Jerusalem time
    // but can be any time zone or length
    "2017": "March 20 12:29 PM 2017",
    "2018": "March 20 6:15 PM 2018",
    "2019": "March 20 11:58 PM 2019",
    "2020": "March 20 5:50 AM 2020",
    "2021": "March 20 11:37 AM 2021",
    "2022": "March 20 5:33 PM 2022",
    "2023": "March 20 11:24 PM 2023",
    "2024": "March 20 5:06 AM 2024",
    "2025": "March 20 11:01 AM 2025",
    "2026": "March 20 4:46 PM 2026",
    "2027": "March 20 10:25 PM 2027",
    "2028": "March 20 4:17 AM 2028"
  }
};

//+++---Manager---+++//
const MaryManage = (function () {

  const manager = Object.create(null);
  const modules = Object.create(null);
  const singletons = Object.create(null);
  const instances = Object.create(null);
  const error = "Cannot require a module that doesn't exist.";

  manager.define = function (name, requires, definition, instance) {
    requires.forEach(function gatherRequires(name, index, array) {
      if (instances[name]) {
        array[index] = modules[name]();
      } else if (singletons[name]) {
        array[index] = modules[name];
      } else {
        throw new Error(error);
      }
    });
    requires.push(manager.require);
    if (instance) {
      instances[name] = true;
      modules[name] = function () {
        return definition.apply(definition, requires);
      };
    } else {
      singletons[name] = true;
      modules[name] = definition.apply(definition, requires);
    }
  };

  manager.require = function (name) {
    if (instances[name]) {
      return modules[name]();
    } else if (singletons[name]) {
      return modules[name];
    } else {
      throw new Error(error);
    }
  };

  manager.isSingleton = function (name) {
    if (singletons[name]) {
      return true;
    } else {
      return false;
    }
  };

  manager.isInstance = function (name) {
    if (instances[name]) {
      return true;
    } else {
      return false;
    }
  };

  manager.requireList = function () {
    return JSON.stringify(Object.keys(modules), null, "  ");
  };

  return manager;

}());
