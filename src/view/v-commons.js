MaryManage.define("view/commons", [
  "utils",
  "MaryMessage",
  "MaryDom"
], function viewCommons(utils, MaryMessage, MaryDom, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const bubbleCheck = utils.bubbleCheck;
const isStandAlone = utils.isStandAlone();
const visHandlers = newObj();
const doc = document;
const win = MaryDom(window);
const body = MaryDom(doc.body);
const wrap = MaryDom("#MaryCalendar");
const views = {
  main: require("view/main"),
  settings: require("view/settings"),
  license: require("view/license")
};

/* functions */
const detectVisAPI = function () {
  const visAPI = newObj();
  if (typeof doc.hidden !== "undefined") {
    visAPI.hidden = "hidden";
    visAPI.eventName = "visibilitychange";
  } else if (typeof doc.webkitHidden !== "undefined") {
    visAPI.hidden = "webkitHidden";
    visAPI.eventName = "webkitvisibilitychange";
  } else if (typeof doc.msHidden !== "undefined") {
    visAPI.hidden = "msHidden";
    visAPI.eventName = "msvisibilitychange";
  }
  if (visAPI.hidden !== undefined) {
    return visAPI;
  }
};

const selectVisHandlers = function () {
  const visAPI = detectVisAPI();
  if (visAPI !== undefined) {
    visHandlers.changeVis = function toggleClock(event) {
      if (document[visAPI.hidden] === false) {
        MaryMessage.publish("refresh");
        MaryMessage.publish("start-time");
        MaryMessage.publish("alarm");
      } else {
        MaryMessage.publish("stop-time");
      }
    };
    visHandlers.eventName = visAPI.eventName;
  } else {
    visHandlers.onFocus = function startClock(event) {
      MaryMessage.publish("refresh");
      MaryMessage.publish("start-time");
      MaryMessage.publish("alarm");
    };
    visHandlers.onBlur = function stopClock(event) {
      MaryMessage.publish("stop-time");
    };
  }
};

const addHighlightHandlers = function () {
  MaryDom([
    views.main.now,
    views.main.settingsButton,
    views.main.licenseButton,
    views.settings.save,
    views.settings.cancel,
    views.license.amen
  ])
    .on("mouseover", function highlight(event) {
      this.obj.class(
        "MaryCalendar_GeneralButtonHover",
        this.index
      );
      freezeEvent(event);
    })
    .on("mouseout", function unHighlight(event) {
      this.obj.removeClass(
        "MaryCalendar_GeneralButtonHover",
        this.index
      );
      freezeEvent(event);
    })
    .on("touchstart", function touchHover(event) {
      setTimeout(function unHighlight() {
        this.obj.removeClass(
          "MaryCalendar_GeneralButtonHover",
          this.index
        );
        freezeEvent(event);
      }.bind(this), 500);
    });
};

const fixMobileScroll = function (target) {
  // firefox needs more height to hide address bar :(
  const calendar = bubbleCheck(target, [
    "MaryCalendar_Main"
  ]);
  if (calendar) {
    return;
  }
  wrap.style([
    "padding-top: 3px;",
    "padding-bottom: 3px;"
  ]);
};

const disableMobileScrollFix = function () {
  if (wrap.first.style.paddingTop === "3px") {
    wrap.style(["padding-top", "padding-bottom"]);
  }
};

/* handlers */
selectVisHandlers();
addHighlightHandlers();

if (isStandAlone) {
  body.on("touchmove", function fixScroll(event) {
    fixMobileScroll(event.target);
  }).on("touchend", function unfixScroll(event) {
    disableMobileScrollFix();
  });
}

if (visHandlers.changeVis) {
  win.on(visHandlers.eventName, visHandlers.changeVis);
} else {
  win.on("focus", visHandlers.onFocus).on("blur", visHandlers.onBlur);
}

/* subscriptions */
MaryMessage.subscribe("switch-view", function switchView(whereTo) {
  MaryDom([views.main.all, views.settings.all, views.license.all])
    .style("display: none");
  views[whereTo].all.style("display");
});

MaryMessage.subscribe("new-window", function newWindow({size}) {
  const newSize = Number(size.match(/\d+/)[0]) + 3 + "px";
  const newWin = window.open(
    window.location.href,
    "Hebrew_Calendar",
    "width=" + newSize + ", height=" + newSize
  );
  MaryDom(newWin).on("load", function (event) {
    setTimeout(function () {
      // right after MaryCalendar stops executing in newWin
      MaryDom(newWin.document.documentElement)
        .style([
          "display: block",
          "height: 100%"
        ])
        .find("h1")
          .style("display: none")
          .restore()
        .find("body")
          .style("padding: 0");
    }, 1);
  });
});

/* exports */
return true;

}, true);
