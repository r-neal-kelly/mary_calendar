MaryManage.define("view/license", [
  "utils",
  "MaryMessage",
  "MaryDom"
], function viewLicense(utils, MaryMessage, MaryDom, require) {

/* constants */
const newObj = utils.newObj;
const freezeEvent = utils.freezeEvent;
const wrap = MaryDom("#MaryCalendar");
const license = newObj();

/* generation */
const generateSkeleton = function () {
  license.all = MaryDom("<div></div>")
    .class("MaryCalendar_Main")
    .style("display: none")
    .appendTo(wrap);
  license.header = MaryDom("<div></div>")
    .class("MaryCalendar_Header")
    .appendTo(license.all);
  license.body = MaryDom("<div></div>")
    .class("MaryCalendar_Body")
    .appendTo(license.all);
  license.footer = MaryDom("<div></div>")
    .class("MaryCalendar_Footer")
    .appendTo(license.all);
};

const generateHeader = function () {
  license.title = MaryDom("<div></div>")
    .class("MaryCalendar_HeaderTitle")
    .addText("License")
    .appendTo(license.header);
};

const generateBody = function () {
  license.text = MaryDom("<div></div>")
    .class("MaryCalendar_License")
    .appendTo(license.body);
};

const generateFooter = function () {
  license.amen = MaryDom("<button>")
    .class("MaryCalendar_GeneralButton")
    .setText("Amen!")
    .appendTo(license.footer);
  license.version = MaryDom("<div></div>")
    .class("MaryCalendar_Version")
    .setText(MaryCalendarVersion)
    .appendTo(license.footer);
};

/* initialize */
generateSkeleton();
generateHeader();
generateBody();
generateFooter();

/* handlers */
license.amen.on("click", function (event) {
  MaryMessage.publish("switch-view", "main");
  freezeEvent(event);
});

/* html */
license.text.addHTML(String.raw`
Copyright © 2022 r-neal-kelly<br>
Copyright © 2017 נהאל<br>
https://github.com/r-neal-kelly/mary_calendar
<br><br>
Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)<br>
https://creativecommons.org/licenses/by-nc-sa/4.0/
<br><br>
Any user-input found in the program is entirely left under the domain of 
the brother or sister who entered it in.
<br><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

FEATURES:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: auto; padding-left: 2em">
    <li>Sabbaths and Feast Days</li>
    <li>offline use</li>
    <li>note-taking</li>
    <li>a day-change alarm</li>
    <li>themes</li>
  </ul>
</div><br>

OPTIONS:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>set equinox from 1 A.D onwards</li>
    <li>set when sundown occurs</li>
    <li>set the Feast of First Fruits</li>
    <li>back up and restore notes</li>
    <li>embed MaryCalendar in your site (1)</li>
    <li>and more (2)</li>
  </ul>
</div><br>

REQUIRES:
<br><br>
<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>an up-to-date browser</li>
    <li>JavaScript</li>
    <li>cookies if you want to save (3)</li>
  </ul>
</div><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

<div style="text-align: center">(1) How to Embed:</div><br>

This is the minimum html required to embed MaryCalendar in your site:
<br><br>

<div style="font-size: .9em; padding-left: 2em">
  &lt;meta charset="utf-8"&gt;<br>
  &lt;script src="MaryCalendar.js"&gt;&lt;/script&gt;<br>
  &lt;div id="MaryCalendar"&gt;&lt;/div&gt;
</div><br>

<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>A &lt;meta&gt; tag with UTF-8 or higher.</li>
    <li>A script tag containing where to find MaryCalendar. This example 
    assumes she's in the same directory as the html file loading her.</li>
    <li>A div with the id "MaryCalendar". This is her home, so take care 
    of her, alright?</li>
  </ul>
</div><br>

She defaults to a size of 336px squared, but you can change this in 
her tag, like so:
<br><br>

<div style="font-size: .9em; padding-left: 2em">
  &lt;div id="MaryCalendar" size="420px"&gt;&lt;/div&gt;
</div><br>

<div style="font-size: .96em">
  <ul style="margin: 0; padding-left: 2em">
    <li>The suggested minimum size is 216px.</li>
    <li>Along with the size, you may style her tag however you like. But 
    she will override three properties: border-box, width, and height. 
    Width and height are set to your chosen size, and border-box ensures 
    an accurate rendering.</li>
    <li>And although it's not required that you use a &lt;div&gt; tag, 
    some other tags may not behave as expected.</li>
    <li>She should not interfere with any of your CSS and hopefully none 
    of your JavaScript. She does use local storage (or document.cookie) 
    to save (3). So don't completely clear them, and everything should 
    be okay.</li>
  </ul>
</div><br>

<div style="text-align: center">(2) How to Config</div><br>

Besides the options that are in her settings, you can also configure 
the JavaScript manually by changing the values in the "config" object 
near the top of MaryCalendar.js
<br><br>

<div style="text-align: center">(3) A Note on Saving</div><br>

Enabled cookies allows for the preferred saving method: HTML5 Local 
Storage. But if the browser doesn't have local storage, MaryCalendar 
will still try to save settings with cookies, however not any notes. 
This is due to cookie-size constraints on some browsers. Saving can be 
completely disabled in the config, or by turning off cookies altogether.
<br><br>

If you want to see what MaryCalendar is storing, open the browser's 
console and type in "localStorage" and/or "document.cookie". She uses 
the prefix "MaryCalendar_" for all her variables.
<br><br>

<div style="text-align: center">Don't Panic</div><br>

During testing, I encountered a rare bug that ended up with me not being 
able to access any of my notes. The bug is fixed now, but should there 
ever be any difficulty getting to your notes in MaryCalendar, 
you can copy and paste the following code into your browser's console 
while the current web page containing her is open. (To access the 
console try hitting 'F12' on your keyboard or looking in the options 
menu. Mobile generally doesn't allow access to the console, so try 
this on desktop/laptop.)<br>

<div style="font-size: .84em; white-space: pre; padding-left: 2em">
(function getNotes() {
  const notes = Object.create(null);
  for (let key in localStorage) {
    if (/MaryCalendar_.*\d$/.test(key)) {
      let prop = key.replace(/[^_]+_/, "");
      notes[prop] = localStorage[key];
    }
  }
  return JSON.stringify(notes, null, "  ")
    .replace(/\n/g, "\n\n");
}());
</div><br>

Now you can copy her text and save it in any text editor. Make sure to 
leave out any quotes next to the '{' and '}' symbols. After resetting the 
calendar, you can try restoring your notes normally.
<br><br>

<div style="text-align: center">~~~~~~~~~~</div><br>

<div style="text-align: center">
(א) Inspiration from the Scripture (ת)
</div><br>

<div style="text-align: center">
~~~Matthew 5:17-20~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">17</span>
Think not that I am come to destroy the law, or the prophets: I am not 
come to destroy, but to fulfil. 
<span style="font-size: .76em">18</span>
For verily I say unto you, Till heaven and earth pass one jot or one 
tittle shall in no wise pass from the law, till all be fulfilled. 
<span style="font-size: .76em">19</span>
Whosoever therefore shall break one of these least commandments, and 
shall teach men so, he shall be called the least in the kingdom of 
heaven: but whosoever shall do and teach them, the same shall be called 
great in the kingdom of heaven. 
<span style="font-size: .76em">20</span>
For I say unto you, that except your righteousness shall exceed the 
righteousness of the scribes and Pharisees, ye shall in no case enter 
into the kingdom of heaven.
</div>
<br>

<div style="text-align: center">
~~~Matthew 22:34-40~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">34</span>
But when the Pharisees had heard that he had put the Sadducees to silence, 
they were gathered together.
<span style="font-size: .76em">35</span>
Then one of them, which was a lawyer, asked him a question, tempting him, 
and saying,
<span style="font-size: .76em">36</span>
Master, which is the great commandment in the law?
<span style="font-size: .76em">37</span>
Yahshua said unto him, Thou shalt love Yahweh thy God with all thy heart, 
and with all thy soul, and with all thy mind.
<span style="font-size: .76em">38</span>
This is the first and great commandment.
<span style="font-size: .76em">39</span>
And the second is like unto it, Thou shalt love thy fellow kin as thyself.
<span style="font-size: .76em">40</span>
On these two commandments hang all the law and the prophets.
</div>
<br>

<div style="text-align: center">
~~~John 14:15~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">15</span> 
If ye love me, keep my commandments.
</div><br>

<div style="text-align: center">
~~~John 15:10~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">10</span> 
If ye keep my commandments, ye shall abide in my love; even as I have 
kept my Father's commandments, and abide in his love.
</div><br>

<div style="text-align: center">
~~~Leviticus 23~~~
</div><br>

<div style="font-size: .96em">

<div style="text-align: center; font-variant: small-caps">
Feasts of Yahweh
</div><br>

<span style="font-size: .76em">1</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">2</span>
Speak unto the children of Israel, and say unto them, Concerning the 
feasts of Yahweh, which ye shall proclaim to be holy convocations, even 
these are my feasts.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Sabbath
</div><br>

<span style="font-size: .76em">3</span>
Six days shall work be done: but the seventh day is the sabbath of rest, 
an holy convocation; ye shall do no work therein: it is the sabbath of 
Yahweh in all your dwellings.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Passover
</div><br>

<span style="font-size: .76em">4</span>
These are the feasts of Yahweh, even holy convocations, which ye shall 
proclaim in their seasons.
<span style="font-size: .76em">5</span>
In the fourteenth day of the first month at even is Yahweh's passover.
<span style="font-size: .76em">6</span>
And on the fifteenth day of the same month is the feast of unleavened 
bread unto Yahweh: seven days ye must eat unleavened bread.
<span style="font-size: .76em">7</span>
In the first day ye shall have an holy convocation: ye shall do no 
servile work therein.
<span style="font-size: .76em">8</span>
But ye shall offer an offering made by fire unto Yahweh seven days: in 
the seventh day is an holy convocation: ye shall do no servile work 
therein.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Firstfruits
</div><br>

<span style="font-size: .76em">9</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">10</span>
Speak unto the children of Israel, and say unto them, When ye be come 
into the land which I give unto you, and shall reap the harvest thereof, 
then ye shall bring a sheaf of the firstfruits of your harvest unto 
the priest:
<span style="font-size: .76em">11</span>
And he shall wave the sheaf before Yahweh, to be accepted for you: on 
the morrow after the sabbath the priest shall wave it.
<span style="font-size: .76em">12</span>
And ye shall offer that day when ye wave the sheaf an he lamb without 
blemish of the first year for a burnt offering unto Yahweh.
<span style="font-size: .76em">13</span>
And the meat offering thereof shall be two tenth deals of fine flour 
mingled with oil, an offering made by fire unto Yahweh for a sweet 
savour: and the drink offering thereof shall be of wine, the fourth 
part of an hin.
<span style="font-size: .76em">14</span>
And ye shall eat neither bread, nor parched corn, nor green ears, until 
the selfsame day that ye have brought an offering unto your God: it 
shall be a statute for ever throughout your generations in all your 
dwellings.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Weeks
</div><br>

<span style="font-size: .76em">15</span>
And ye shall count unto you from the morrow after the sabbath, from the 
day that ye brought the sheaf of the wave offering; seven sabbaths 
shall be complete:
<span style="font-size: .76em">16</span>
Even unto the morrow after the seventh sabbath shall ye number fifty 
days; and ye shall offer a new meat offering unto Yahweh.
<span style="font-size: .76em">17</span>
Ye shall bring out of your habitations two wave loaves of two tenth 
deals: they shall be of fine flour; they shall be baken with leaven; 
they are the firstfruits unto Yahweh.
<span style="font-size: .76em">18</span>
And ye shall offer with the bread seven lambs without blemish of the 
first year, and one young bullock, and two rams: they shall be for a 
burnt offering unto Yahweh, with their meat offering, and their drink 
offerings, even an offering made by fire, of sweet savour unto Yahweh.
<span style="font-size: .76em">19</span>
Then ye shall sacrifice one kid of the goats for a sin offering, and 
two lambs of the first year for a sacrifice of peace offerings.
<span style="font-size: .76em">20</span>
And the priest shall wave them with the bread of the firstfruits for 
a wave offering before Yahweh, with the two lambs: they shall be holy 
to Yahweh for the priest.
<span style="font-size: .76em">21</span>
And ye shall proclaim on the selfsame day, that it may be an holy 
convocation unto you: ye shall do no servile work therein: it shall be 
a statute for ever in all your dwellings throughout your generations.
<span style="font-size: .76em">22</span>
And when ye reap the harvest of your land, thou shalt not make clean 
riddance of the corners of thy field when thou reapest, neither shalt 
thou gather any gleaning of thy harvest: thou shalt leave them unto the 
poor, and to the stranger: I am Yahweh your God.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Trumpets
</div><br>

<span style="font-size: .76em">23</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">24</span>
Speak unto the children of Israel, saying, In the seventh month, in the 
first day of the month, shall ye have a sabbath, a memorial of blowing 
of trumpets, an holy convocation.
<span style="font-size: .76em">25</span>
Ye shall do no servile work therein: but ye shall offer an offering made 
by fire unto Yahweh.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Day of Atonement
</div><br>

<span style="font-size: .76em">26</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">27</span>
Also on the tenth day of this seventh month there shall be a day of 
atonement: it shall be an holy convocation unto you; and ye shall 
afflict your souls, and offer an offering made by fire unto Yahweh.
<span style="font-size: .76em">28</span>
And ye shall do no work in that same day: for it is a day of atonement, 
to make an atonement for you before Yahweh your God.
<span style="font-size: .76em">29</span>
For whatsoever soul it be that shall not be afflicted in that same day, 
he shall be cut off from among his people.
<span style="font-size: .76em">30</span>
And whatsoever soul it be that doeth any work in that same day, the same 
soul will I destroy from among his people.
<span style="font-size: .76em">31</span>
Ye shall do no manner of work: it shall be a statute for ever throughout 
your generations in all your dwellings.
<span style="font-size: .76em">32</span>
It shall be unto you a sabbath of rest, and ye shall afflict your souls: 
in the ninth day of the month at even, from even unto even, shall ye 
celebrate your sabbath.
<br><br>

<div style="text-align: center; font-variant: small-caps">
The Feast of Tabernacles
</div><br>

<span style="font-size: .76em">33</span>
And Yahweh spake unto Moses, saying,
<span style="font-size: .76em">34</span>
Speak unto the children of Israel, saying, The fifteenth day of this 
seventh month shall be the feast of tabernacles for seven days unto Yahweh.
<span style="font-size: .76em">35</span>
On the first day shall be an holy convocation: ye shall do no servile 
work therein.
<span style="font-size: .76em">36</span>
Seven days ye shall offer an offering made by fire unto Yahweh: on the 
eighth day shall be an holy convocation unto you; and ye shall offer an 
offering made by fire unto Yahweh: it is a solemn assembly; and ye shall 
do no servile work therein.
<span style="font-size: .76em">37</span>
These are the feasts of Yahweh, which ye shall proclaim to be holy 
convocations, to offer an offering made by fire unto Yahweh, a burnt 
offering, and a meat offering, a sacrifice, and drink offerings, every 
thing upon his day:
<span style="font-size: .76em">38</span>
Beside the sabbaths of Yahweh, and beside your gifts, and beside all 
your vows, and beside all your freewill offerings, which ye give unto 
Yahweh.
<span style="font-size: .76em">39</span>
Also in the fifteenth day of the seventh month, when ye have gathered 
in the fruit of the land, ye shall keep a feast unto Yahweh seven days: 
on the first day shall be a sabbath, and on the eighth day shall be a 
sabbath.
<span style="font-size: .76em">40</span>
And ye shall take you on the first day the boughs of goodly trees, 
branches of palm trees, and the boughs of thick trees, and willows of 
the brook; and ye shall rejoice before Yahweh your God seven days.
<span style="font-size: .76em">41</span>
And ye shall keep it a feast unto Yahweh seven days in the year. It 
shall be a statute for ever in your generations: ye shall celebrate it 
in the seventh month.
<span style="font-size: .76em">42</span>
Ye shall dwell in booths seven days; all that are Israelites born shall 
dwell in booths:
<span style="font-size: .76em">43</span>
That your generations may know that I made the children of Israel to 
dwell in booths, when I brought them out of the land of Egypt: I am 
Yahweh your God.
<span style="font-size: .76em">44</span>
And Moses declared unto the children of Israel the feasts of Yahweh.
</div><br>

<div style="text-align: center">
~~~I Corinthians 5:7-8~~~
</div><br>

<div style="font-size: .96em">
<span style="font-size: .76em">7</span>
Purge out therefore the old leaven, that ye may be a new lump, as ye 
are unleavened. For even Christ our passover is sacrificed for us:
<span style="font-size: .76em">8</span>
Therefore let us keep the feast, not with old leaven, neither with the 
leaven of malice and wickedness; but with the unleavened bread of 
sincerity and truth.
</div>
`);

/* exports */
return license;

}, true);
