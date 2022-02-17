MaryManage.define("view/css", [
  "utils",
  "MaryMessage",
  "MaryDom",
  "view/modals"
], function viewCSS(utils, MaryMessage, MaryDom, modals, require) {

/* constants */
const newObj = utils.newObj;
const isStandAlone = utils.isStandAlone();
const themes = newObj();
const sheet = (document.querySelector("#MaryCalendarCSS")) ?
  MaryDom("#MaryCalendarCSS") :
  MaryDom("<style id='MaryCalendarCSS'>").appendTo(document.head);

/* functions */
const tagSize = (function readyWrap() {
  const wrap = MaryDom("#MaryCalendar")
    .setHTML("")
    .style(["box-sizing: border-box;"]);
  const regex = function (possibleNumber) {
    if (/\d+/.test(possibleNumber)) {
      return possibleNumber.match(/\d+/)[0];
    } else {
      return 0;
    }
  };
  const getSize = function () {
    let size = Math.max(
      regex(wrap.getStyle("width")),
      regex(wrap.getStyle("height")),
      regex(wrap.getAttr("size")),
      regex(wrap.getAttr("length")),
      regex(wrap.getAttr("width")),
      regex(wrap.getAttr("height"))
    );
    if (size === 0) {
      size = "336px";
    } else {
      size += "px";
    }
    return size;
  };
  const error = "Sorry! MaryCalendar, she just couldn't find her home " +
    "tag! Can you make sure her tag is in the web page? It should look " +
    "like this: <pre>&lt;div id=\"MaryCalendar\"&gt;&lt;/div&gt;</pre> " +
    "If you have any more trouble, please take a look at the readme!";
  let size;
  if (!wrap.first) {
    modals.Error(error);
    throw new Error(
      error.replace(/<pre>|<\/pre>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
    );
  }
  size = getSize();
  if (isStandAlone === false) {
    MaryMessage.publish("override-initial-size", {
      size: size
    });
    wrap.style([
      "width: " + size,
      "height: " + size
    ]);
  }
  return size;
}());

const define = function (selector, classRules) {
  let style = selector + " {\n";
  for (let declaration of classRules) {
    declaration = (/;$/.test(declaration)) ?
      declaration : declaration + ";";
    style += "  " + declaration + "\n";
  }
  style += "}\n";
  sheet.addText(style);
};

const metaDefine = function (statement, selector, classRules) {
  let style = statement + " {\n" + "  " + selector + " {\n";
  for (let declaration of classRules) {
    declaration = (/;$/.test(declaration)) ?
      declaration : declaration + ";";
    style += "    " + declaration + "\n";
  }
  style += "  }\n}\n";
  sheet.addText(style);
};

const comment = function (comment) {
  if (!/^\/\*/.test(comment)) {
    comment = "/* " + comment;
  }
  if (!/\*\/$/.test(comment)) {
    comment = comment + " */";
  }
  sheet.addText("\n\n" + comment);
};

const curryRatio = function (base) {
  base = Number(base.match(/\d+/)[0]);
  return function ratio(px) {
    // px : 336 === x : base
    let x = px * base / 336;
    x = String(x).split(".");
    if (x[1]) {
      if (Number("." + x[1]) >= 0.75) {
        x = Number(x[0]) + 1;
      } else if (Number("." + x[1]) <= 0.25) {
        x = Number(x[0]);
      } else {
        x = Number(x[0] + ".5");
      }
    } else {
      x = Number(x[0]);
    }
    return String(x) + "px";
  };
};

const curryRatio$ = function (base) {
  base = Number(base.match(/\d+/)[0]);
  return function ratio$(px) {
    // px : 336 === x : base
    const x = px * base / 336;
    return String(x);
  };
};

/* palettes */
const g = {
  // glory
  _1: "#463505",
  _1T: "rgba(70, 53, 5, 0.84)",
  _2: "#ffe69c",
  _3: "#f5c63a",
  _4: "#806515",
  _5: "#a67c00"
};

const s = {
  // sky
  _1: "#b0cee6",
  _1T: "rgba(176, 206, 230, 0.84)",
  _2: "#7baace",
  _3: "#2a4d69",
  _4: "#eae6ef",
  _5: "#284f6f",
  _6: "#cbdfef"
};

const d = {
  // deep
  _1: "#011f4b",
  _1T: "rgba(1, 31, 75, 0.84)",
  _2: "#b3cde0",
  _3: "#6497b1",
  _4: "#03396c",
  _5: "#005b96"
};

const v = {
  // vital
  _1: "#1b332d",
  _1T: "rgba(27, 51, 45, 0.84)",
  _2: "#b7d6c2",
  _3: "#b7d4c0",
  _4: "#21504d",
  _5: "#255d4d",
  _6: "#6d3c21"
};

const p = {
  // pure
  _1: "#f0f0f5", //f5f5f9
  _1T: "rgba(247, 247, 247, 0.84)",
  _2: "#f7f7f7",
  _3: "#363a3a",
  _4: "#536878",
  _5: "#fdfeff",
  _6: "#fdfdff",
  _7: "#3295a5",
  _8: "#5168bb"
};

const a = {
  // adam
  _1: "#ffe0bd",
  _2: "#f7e0d6",
  _3: "#e35d6a",
  _3T: "rgba(227, 93, 106, 0.84)",
  _4: "#5f050e",
  _4T: "rgba(95, 5, 14, 0.84)",
  _5: "#fdd4c2",
  _6: "#f1bea8"
};

/* themes */
themes.Glory = {
  defBack: g._1,
  defText: g._2,
  h1Text: g._2,
  inputBack: g._3,
  inputBorder: g._4,
  placeholder: g._5,
  bodyBack: g._5,
  bodyBorder: g._4,
  navBack: g._3,
  navText: g._1,
  highBack: g._1,
  highText: g._2,
  popBack: g._1T,
  popBorder: g._1,
  popText: g._2,
  textareaBack: g._2,
  textareaBorder: g._1,
  textareaText: g._1T,
  timeBack: g._4,
  timeBorder: g._1,
  timeText: g._2,
  tabsBack: g._4,
  qAColor: g._2,
  regular: g._2,
  regularBack: g._1,
  regularBorder: g._3,
  regularText: g._2,
  special: "#FFFFF0",
  specialBack: g._1,
  specialBorder: "#f3f3da",
  specialText: "#FFFFF0",
  sabbath: "#e5e1e6",
  sabbathBack: g._1,
  sabbathBorder: "#c9c5cc",
  sabbathText: "#e5e1e6"
};

themes.Sky = {
  defBack: s._2,
  defText: s._3,
  h1Text: s._4,
  inputBack: s._4,
  inputBorder: s._1,
  placeholder: s._5,
  bodyBack: s._6,
  bodyBorder: s._1,
  navBack: s._4,
  navText: s._3,
  highBack: s._1,
  highText: s._5,
  popBack: s._1T,
  popBorder: s._2,
  popText: s._3,
  textareaBack: s._6,
  textareaBorder: s._2,
  textareaText: s._3,
  timeBack: s._1,
  timeBorder: s._2,
  timeText: s._5,
  tabsBack: s._1,
  qAColor: s._3,
  regular: s._3,
  regularBack: s._4,
  regularBorder: s._2,
  regularText: "#0071c7",
  special: "#881098",
  specialBack: "#ebe0ec",
  specialBorder: "#98669e",
  specialText: "#881098",
  sabbath: "#197d18",
  sabbathBack: "#d6e4d6",
  sabbathBorder: "#4d964c",
  sabbathText: "#197d18"
};

themes.Deep = {
  defBack: d._1,
  defText: d._2,
  h1Text: d._2,
  inputBack: d._3,
  inputBorder: d._4,
  placeholder: d._5,
  bodyBack: d._5,
  bodyBorder: d._4,
  navBack: d._3,
  navText: d._1,
  highBack: d._1,
  highText: d._2,
  popBack: d._1T,
  popBorder: d._1,
  popText: d._2,
  textareaBack: d._2,
  textareaBorder: d._1,
  textareaText: d._1T,
  timeBack: d._4,
  timeBorder: d._1,
  timeText: d._2,
  tabsBack: d._4,
  qAColor: d._2,
  regular: d._2,
  regularBack: "#335f64",
  regularBorder: d._3,
  regularText: "#ddebed",
  special: "#c7a1cc",
  specialBack: "#455475",
  specialBorder: "#738dc4",
  specialText: "#e3e8f3",
  sabbath: "#c7ca6e",
  sabbathBack: "#676333",
  sabbathBorder: "#ada656",
  sabbathText: "#eeeddd"
};

themes.Vital = {
  defBack: v._1,
  defText: v._2,
  h1Text: v._3,
  inputBack: v._2,
  inputBorder: v._4,
  placeholder: v._5,
  bodyBack: v._5,
  bodyBorder: v._4,
  navBack: v._6,
  navText: v._3,
  highBack: v._1,
  highText: v._2,
  popBack: v._1T,
  popBorder: v._6,
  popText: v._3,
  textareaBack: v._3,
  textareaBorder: v._6,
  textareaText: v._1T,
  timeBack: v._4,
  timeBorder: v._1,
  timeText: v._2,
  tabsBack: v._4,
  qAColor: v._2,
  regular: v._2,
  regularBack: "#27582d",
  regularBorder: "#75af7f",
  regularText: v._2,
  special: "#75cc6a",
  specialBack: "#27582d",
  specialBorder: "#5ec16b",
  specialText: "#75cc6a",
  sabbath: "#d8cc43",
  sabbathBack: "#27582d",
  sabbathBorder: "#c5b819",
  sabbathText: "#d8cc43"
};

themes.Pure = {
  defBack: p._6,
  defText: p._4,
  h1Text: p._3,
  inputBack: p._2,
  inputBorder: p._1,
  placeholder: p._4,
  bodyBack: p._5,
  bodyBorder: p._2,
  navBack: p._1,
  navText: p._3,
  highBack: p._3,
  highText: p._1,
  popBack: p._1T,
  popBorder: p._1,
  popText: p._4,
  textareaBack: p._1,
  textareaBorder: p._2,
  textareaText: p._3,
  timeBack: p._2,
  timeBorder: p._3,
  timeText: p._4,
  tabsBack: p._2,
  qAColor: p._4,
  regular: p._4,
  regularBack: p._1,
  regularBorder: p._2,
  regularText: p._4,
  special: p._7,
  specialBack: p._1,
  specialBorder: p._7,
  specialText: p._7,
  sabbath: p._8,
  sabbathBack: p._1,
  sabbathBorder: p._8,
  sabbathText: p._8
};

themes.Adam = {
  defBack: a._2,
  defText: a._4,
  h1Text: a._3,
  inputBack: a._1,
  inputBorder: a._6,
  placeholder: a._3,
  bodyBack: a._5,
  bodyBorder: a._6,
  navBack: a._1,
  navText: a._3,
  highBack: a._3,
  highText: a._1,
  popBack: a._4T,
  popBorder: a._2,
  popText: a._2,
  textareaBack: a._2,
  textareaBorder: a._2,
  textareaText: a._4,
  timeBack: a._6,
  timeBorder: a._3,
  timeText: a._4,
  tabsBack: a._6,
  qAColor: a._1,
  regular: a._4,
  regularBack: a._1,
  regularBorder: "#e29f82",
  regularText: a._4,
  special: "#6c61ce",
  specialBack: a._1,
  specialBorder: "#5449b7",
  specialText: "#6c61ce",
  sabbath: "#f12d40",
  sabbathBack: a._1,
  sabbathBorder: "#e04453",
  sabbathText: "#f12d40"
};

/* classes */
MaryMessage.subscribe("generate-css", function generateCSS({theme, size}) {

const t = themes[theme];
const s = (isStandAlone) ? 
  size : tagSize;
const r = curryRatio(s);
const r$ = curryRatio$(s);
sheet.setText("\n");

comment("/*+++---Stand-Alone Version Only---+++*/");
define(".MaryCalendarHTML", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "height: 76%;"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarHTML", [
  "display: block;",
  "height: 100%;"
]);

define(".MaryCalendarBODY", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "width: 100%;",
  "margin: auto;",
  "background-color: " + t.defBack + ";",
  "text-align: center;",
  "font-family: 'Tahoma', 'Helvetica', sans-serif;",
  "font-size: " + r(16) + ";",
  "color: " + t.defText + ";"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarBODY", [
  "padding-top: 1px;"
]);

define(".MaryCalendarH1", [
  "padding: 0 " + r(12) + " 0 " + r(12) + ";",
  "font-family: serif;",
  "color: " + t.h1Text + ";"
]);

metaDefine("@media screen and (max-height: 480px)", ".MaryCalendarH1", [
  "display: none;"
]);

comment("/*+++---Calendar Wrap---+++*/");
define("#MaryCalendar", [
  "box-sizing: border-box;",
  "background-color: transparent;"
]);

comment("/*+++---Resets---+++*/");
define("#MaryCalendar input", [
  "background-color: " + t.inputBack + ";",
  "border: " + r(2) + " solid " + t.inputBorder + ";",
  "padding-left: " + r(3) + ";",
  "padding-right: " + r(3) + ";",
  "font-size: .84em;",
  "text-align: center;"
]);

define("#MaryCalendar textarea", [
  "font-size: .84em;"
]);

define("#MaryCalendar select", [
  "background-color: " + t.inputBack + ";",
  "border: " + r(2) + " solid " + t.inputBorder + ";",
  "font-size: .84em;"
]);

define("#MaryCalendar button", [
  "background: none;",
  "padding: 0;",
  "border: 0 solid transparent;",
  "color: " + t.defText + ";",
  "font-size: .84em;"
]);

define("#MaryCalendar input[type=checkbox]", [
  "transform: scale(" + r$(1) + ");"
]);

comment("/* box-sizing */");
define("#MaryCalendar *, #MaryCalendar *:before, #MaryCalendar *:after", [
  "box-sizing: inherit;"
]);

comment("/* focus highlights */");
define("#MaryCalendar *:focus", [
  "outline: 0;"
]);

define("#MaryCalendar button::-moz-focus-inner", [
  "border: 0;"
]);

comment("/* placeholder color */");
/* WebKit, Blink, Edge */
define("#MaryCalendar ::-webkit-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

/* Mozilla Firefox 4 to 18 */
define("#MaryCalendar :-moz-placeholder", [
  "color: " + t.placeholder + ";",
  "opacity: 1;"
]);

/* Mozilla Firefox 19+ */
define("#MaryCalendar ::-moz-placeholder", [
  "color: " + t.placeholder + ";",
  "opacity: 1;"
]);

/* Internet Explorer 10-11 */
define("#MaryCalendar :-ms-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

/* Microsoft Edge */
define("#MaryCalendar ::-ms-input-placeholder", [
  "color: " + t.placeholder + ";"
]);

comment("/*+++---Skeleton---+++*/");
define("#MaryCalendar .MaryCalendar_Main", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: " + s + ";",
  "height: " + s + ";",
  "margin: auto;",
  "background-color: " + t.bodyBack + ";",
  "border: " + r(3) + " solid " + t.navBack + ";",
  "border-radius: " + r(12) + ";",
  "box-shadow: 0 0 " + r(30) + " " + t.bodyBack + ";",
  "text-align: center;",
  "letter-spacing: 0.03125em;", // .5px from 16
  "font-size: " + r(16) + ";",
  "font-family: 'Tahoma', 'Helvetica', sans-serif;",
  "color: " + t.defText + ";",
  // so annoying how firefox randomly selects stuff on a single click!
  "-moz-user-select: none;"
]);

metaDefine(
"@media screen and (max-width: 640px)",
"#MaryCalendar .MaryCalendar_Main", [
  "box-shadow: none;"
]);

define("#MaryCalendar .MaryCalendar_Header", [
  "display: flex;",
  "justify-content: center;",
  "width: 100%;",
  "height: 8%;",
  "background-color: " + t.navBack + ";",
  "border-radius: " + r(5) + " " + r(5) + " 0 0;"
]);

define("#MaryCalendar .MaryCalendar_Body", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "position: relative;",
  "width: 100%;",
  "height: 75%;",
  "border-style: solid;",
  "border-width: " +
    r(2) + " " +
    r(1) + " " +
    r(2) + " " +
    r(1) + ";",
  "border-color: " + t.bodyBorder + ";"
]);

define("#MaryCalendar .MaryCalendar_Footer", [
  "display: flex;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: 100%;",
  "height: 17%;",
  "background-color: " + t.navBack + ";",
  "border-radius: 0 0 " + r(5) + " " + r(5) + ";"
]);

define("#MaryCalendar .MaryCalendar_Modal", [
  "z-index: 7;",
  "position: absolute;",
  "right: 12%;",
  "width: 76%;",
  "max-height: 76%;",
  "background-color: " + t.popBack + ";",
  "padding: " + r(12) + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(36) + ";",
  "color: "+ t.popText + ";",
  "font-size: .96em;"
]);

define("#MaryCalendar .MaryCalendar_ModalDiv", [
  "max-height: 11.5em",
  "overflow-y: auto",
  "padding: 3%"
]);

define("#MaryCalendar .MaryCalendar_ModalButton", [
  "width: " + r(72) + ";",
  "height: auto;",
  "margin: 0 " + r(6) + " 0 " + r(6) + ";",
  "padding: " + r(6) + ";",
  "background-color: " + t.popText + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(12) + ";",
  "color: " + t.popBack + ";"
]);

comment("/*+++---Header---+++*/");
define("#MaryCalendar .MaryCalendar_HeaderPrevious", [
  "width: 37%;",
  "height: 100%;",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_HeaderTitle", [
  "width: 26%;",
  "height: 100%;",
  "color: " + t.navText + ";",
  "font-size: 1em;"
]);

define("#MaryCalendar .MaryCalendar_HeaderNext", [
  "width: 37%;",
  "height: 100%;",
  "color: " + t.navText + ";"
]);

comment("/*+++---Calendar Body---+++*/");
define("#MaryCalendar .MaryCalendar_MonthJump", [
  "display: flex;",
  "justify-content: space-around;",
  "flex-wrap: wrap;",
  "position: absolute;",
  "top: " + r(-2) + ";",
  "z-index: 2;",
  "width: 66.67%;",
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(10) + ";"
]);

define(
"#MaryCalendar .MaryCalendar_MonthJump .MaryCalendar_GeneralButton", [
  "width: 50%;",
  "margin: 0;",
  "padding: " + r(7) + " 0 " + r(7) + " 0;",
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_Row", [
  "display: flex;",
  "justify-content: center;",
  "align-items: center;",
  "position: relative;",
  "width: 89.635%", // 294px
  "height: 17.25%;" // 42px
]);

define("#MaryCalendar .MaryCalendar_RowButton", [
  "position: relative;",
  "width: 12.25%;", // 36px
  "height: 85.72%", // 36px
  "margin: auto;",
  "border: " + r(2) + " solid transparent;",
  "border-radius: " + r(10) + ";"
]);

define("#MaryCalendar .MaryCalendar_NoteIndicator", [
  "position: absolute;",
  "top: 8.33%;",
  "right: 8.33%;",
  "font-size: .6em;"
]);

define("#MaryCalendar .MaryCalendar_AlarmIndicator", [
  "position: absolute;",
  "top: 8.33%;",
  "left: 8.33%;",
  "font-size: .6em;"
]);

define(
"#MaryCalendar .MaryCalendar_RowPopup," +
"#MaryCalendar .MaryCalendar_RowNote", [
  "display: flex;",
  "flex-direction: column;",
  "align-items: center;",
  "position: absolute;",
  "top: 100%;", // 42px
  "z-index: 2;",
  "width: 100%;",
  "padding: " + r(5) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  "border-radius: " + r(10) + ";",
  "color: " + t.popText + ";",
  "font-weight: normal;",
  "font-size: .84em;"
]);

define("#MaryCalendar .MaryCalendar_RowNote", [
  "height: 224%;", // of 42px
  "-moz-user-select: text;"
]);

define(
"#MaryCalendar .MaryCalendar_NoteText," +
"#MaryCalendar .MaryCalendar_NoteInput", [
  "width: 84%;", // of 294px
  "height: 100%;", // take up the rest of the div
  "font-size: .9em;"
]);

define("#MaryCalendar .MaryCalendar_NoteText", [
  "overflow-y: auto;",
  "padding: 0 " + r(3) + " 0 " + r(3) + ";",
  "background-color: transparent;",
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_NoteInput", [
  "background-color: " + t.textareaBack + ";",
  "border: " + r(1) + " solid " + t.textareaBorder + ";",
  "resize: vertical;",
  "color: " + t.textareaText + ";"
]);

define(
"#MaryCalendar .MaryCalendar_NoteButtonLeft," +
"#MaryCalendar .MaryCalendar_NoteButtonRight", [
  "position: absolute;",
  "top: 3%;",
  "border-radius: " + r(10) + ";",
  "color: " + t.popText + ";",
  "font-size: .9em;",
  "font-variant: small-caps;",
  "letter-spacing: 0.0125em;" // .2px from 16
]);

define("#MaryCalendar .MaryCalendar_NoteButtonLeft", [
  "left: 3%;"
]);

define("#MaryCalendar .MaryCalendar_NoteButtonRight", [
  "right: 3%;"
]);

define("#MaryCalendar .MaryCalendar_Time", [
  "display: flex;",
  "flex-direction: column;",
  "justify-content: center;",
  "align-items: center;",
  "z-index: 1;",
  "min-width: 7.2em;",
  "height: 8.5%;",
  "padding: " + r(1) + " " + r(5) + " " + r(1) + " " + r(5) + ";",
  "background-color: " + t.timeBack + ";",
  "border: " + r(1) + " solid " + t.timeBorder + ";",
  "border-radius: " + r(12) + ";",
  "font-size: .84em;",
  "color: " + t.timeText + ";"
]);

define("#MaryCalendar .MaryCalendar_DayRegular", [
  "color: " + t.regular + ";"
]);

define("#MaryCalendar .MaryCalendar_DaySpecial", [
  "color: " + t.special + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_DaySabbath", [
  "color: " + t.sabbath + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_CurrentDayRegular", [
  "background-color: " + t.regularBack + ";",
  "border: " + r(2) + " solid " + t.regularBorder + ";",
  "color: " + t.regularText + ";"
]);

define("#MaryCalendar .MaryCalendar_CurrentDaySpecial", [
  "background-color: " + t.specialBack + ";",
  "border: " + r(2) + " solid " + t.specialBorder + ";",
  "color: " + t.specialText + ";"
]);

define("#MaryCalendar .MaryCalendar_CurrentDaySabbath", [
  "background-color: " + t.sabbathBack + ";",
  "border: " + r(2) + " solid " + t.sabbathBorder + ";",
  "color: " + t.sabbathText + ";"
]);

define("#MaryCalendar .MaryCalendar_RowButtonSelected", [
  "background-color: " + t.popBack + ";",
  "border: " + r(2) + " solid " + t.popBorder + ";",
  // this makes all three have the same color on highlight...
  "color: " + t.popText + ";"
]);

define("#MaryCalendar .MaryCalendar_SpecialPopUp", [
  "color: " + t.special + ";",
  "font-weight: bold;"
]);

define("#MaryCalendar .MaryCalendar_SabbathPopUp", [
  "color: " + t.sabbath + ";",
  "font-weight: bold;"
]);

comment("/*+++---Settings and License Body---+++*/");
define("#MaryCalendar .MaryCalendar_Tabs", [
  "display: flex;",
  "justify-content: space-around;",
  "position: absolute;",
  "top: 0%;",
  "right: 0%;",
  "width: 100%;",
  "height: 11.5%;",
  "background-color: " + t.tabsBack + ";",
  "border-bottom: " + r(2) + " solid " + t.navBack + ";"
]);

define("#MaryCalendar .MaryCalendar_TabButton", [
  "position: relative;",
  "top: " + r(2) + ";",
  "padding: 0 " + r(3) + " 0 " + r(3) + ";"
]);

define("#MaryCalendar .MaryCalendar_TabButtonSelected", [
  "background-color: " + t.bodyBack + ";",
  "border: " + r(2) + " solid " + t.navBack + ";",
  "border-bottom: 0;",
  "border-radius: " + r(6) + " " + r(6) + " 0 0;"
]);

define("#MaryCalendar .MaryCalendar_TabSection", [
  "margin: auto;",
  "background-color: " + t.bodyBack + ";",
  "font-size: .9em;",
  "letter-spacing: 0.04375em;", // .7px from 16
  "-moz-user-select: text;"
]);

define("#MaryCalendar .MaryCalendar_MoreDiv", [
  "margin: " + r(14) + ";"
]);

define("#MaryCalendar .MaryCalendar_BackupButton", [
  "margin: 0 " + r(12) + " 0 " + r(12) + ";",
  "font-size: 1.08em;",
  "font-variant: small-caps;"
]);

define("#MaryCalendar .MaryCalendar_BackupLink", [
  "display: block;",
  "margin-top: .6em;",
  "font-size: 1.08em;",
  "color: " + t.defText + ";"
]);

define("#MaryCalendar .MaryCalendar_Restore", [
  "width: 100%",
  "background-color: " + t.popText + ";",
  "color: " + t.popBack + ";"
]);

define("#MaryCalendar .MaryCalendar_Question", [
  "position: absolute;",
  "bottom: 3%;",
  "right: 2%;",
  "width: 7.4%;",
  "padding: " + r(3) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(1) + " solid " + t.popBorder + ";",
  "border-radius: " + r(30) + ";",
  "color: " + t.qAColor + ";"
]);

define("#MaryCalendar .MaryCalendar_Answer", [
  "position: absolute;",
  "z-index: 2;",
  "top: 0%;",
  "right: 150%;",
  "width: 1212%;",
  "padding: " + r(3) + ";",
  "background-color: " + t.popBack + ";",
  "border: " + r(1) + " solid " + t.popBorder + ";",
  "border-radius: " + r(30) + ";",
  "font-size: .9em;",
  "color: " + t.qAColor + ";"
]);

define("#MaryCalendar .MaryCalendar_License", [
  "padding: " + r(10) + ";",
  "overflow-y: auto;",
  "font-size: .84em;",
  "text-align: left;",
  "letter-spacing: 0.0625em;", // 1px from 16
  "-moz-user-select: text;"
]);

comment("/*+++---Footer---+++*/");
define("#MaryCalendar .MaryCalendar_Now", [
  "width: 72.72%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_SettingsButton", [
  "position: absolute;",
  "bottom: 12%;",
  "right: 1%;",
  "width: 10.91%;",
  "height: 50%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_LicenseButton", [
  "position: absolute;",
  "bottom: 12%;",
  "left: 1%;",
  "width: 10.91%;",
  "height: 50%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_GeneralButton", [
  "width: 17%;",
  "height: 50%;",
  "margin: 0 3.03% 0 3.03%;",
  "border-radius: " + r(15) + ";",
  "color: " + t.navText + ";"
]);

define("#MaryCalendar .MaryCalendar_GeneralButtonHover", [
  "background-color: " + t.highBack + ";",
  "color: " + t.highText + ";"
]);

define("#MaryCalendar .MaryCalendar_Version", [
  "position: absolute;",
  "bottom: 0%;",
  "right: 0%;",
  "padding: " + r(7) + ";",
  "font-size: .72em;",
  "color: " + t.navText + ";"
]);

});

/* exports */
return true;

}, true);
