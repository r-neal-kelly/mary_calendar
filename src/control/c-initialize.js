//+++---Initialize---+++//
MaryManage.define("control/initialize", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "model/vars"
], function controlInitialize(utils, MaryMessage, MaryDom, vars, require) {

/* constants */
const win = MaryDom(window);

/* initialize */
const initialize = function () {
  const isStandAlone = utils.isStandAlone();
  require("view/css");
  require("view/commons");
  require("control/main");
  if (isStandAlone === false) {
    MaryMessage.publish("disable-stand-alone");
  }
  if (vars.safeMode === "on") {
    MaryMessage.publish("enter-safeMode");
  } else {
    MaryMessage.publish("initialize");
  }
};

/* handlers */
win.once("load", function init(event) {
  initialize();
});

/* exports */
return true;

});
