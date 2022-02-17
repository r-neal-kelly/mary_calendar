# Mary Calendar
My interpretation of a Biblical Hebrew calendar. Designed to work solo in the browser or to be embedded in another webpage!

## Features: 
- Sabbaths and Feast Days
- offline use
- note-taking
- a day-change alarm
- themes

## Options: 
- set equinox from 1 A.D onwards
- set when sundown occurs
- set the Feast of First Fruits
- back up and restore notes
- embed MaryCalendar in your site (1)
- and more (2)

## Requires: 
- an up-to-date browser (circa 2017 onwards)
- JavaScript
- cookies if you want to save (3)

## How to:

### Embed:
- This is the minimum html required to embed MaryCalendar in your site: 
    ```
    <meta charset="utf-8">
    <script src="MaryCalendar.js"></script>
    <div id="MaryCalendar"></div>
    ```
- A meta tag with UTF-8 or higher.
- A script tag containing where to find MaryCalendar. This example assumes it's in the same directory as the html file loading it.
- A div with the id "MaryCalendar". This is the program's home.
- It defaults to a size of 336px squared, but you can change this in the tag, like so:
    ```
    <div id="MaryCalendar" size="420px"></div>
    ```
- The suggested minimum size is 216px.
- Along with the size, you may style the calendar's tag however you like. But it will override three properties: border-box, width, and height. Width and height are set to your chosen size, and border-box ensures an accurate rendering.
- And although it's not required that you use a div tag, some other tags may not behave as expected.
- The calendar should not interfere with any of your CSS and hopefully none of your JavaScript. It does use local storage (or document.cookie) to save (3). So don't completely clear them, and everything should be okay.

### Config:
- Besides the options that are in the settings, you can also configure the JavaScript manually by changing the values in the "config" object near the top of MaryCalendar.js 

### Save:
- Enabled cookies allows for the preferred saving method: HTML5 Local Storage. But if the browser doesn't have local storage, MaryCalendar will still try to save settings with cookies, however not any notes. This is due to cookie-size constraints on some browsers. Saving can be completely disabled in the config, or by turning off cookies altogether.
- If you want to see what MaryCalendar is storing, open the browser's console and type in "localStorage" and/or "document.cookie". It uses the prefix "MaryCalendar_" for all variables.

### Recover Notes:
- During testing, I encountered a rare bug that ended up with me not being able to access any of my notes. The bug is fixed now, but should there ever be any difficulty getting to your notes in MaryCalendar, you can copy and paste the following code into your browser's console while the current web page containing it is open. (To access the console try hitting 'F12' on your keyboard or looking in the options menu. Mobile generally doesn't allow access to the console, so try this on desktop/laptop.)
    ```
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
    ```
- Now you can copy your notes and save them in any text editor. Make sure to leave out any quotes next to the '{' and '}' symbols. After resetting the calendar, you can try restoring your notes normally. 

## (א) Inspiration from the Scripture (ת)

### Matthew 5:17-20

17 Think not that I am come to destroy the law, or the prophets: I am not come to destroy, but to fulfil. 18 For verily I say unto you, Till heaven and earth pass one jot or one tittle shall in no wise pass from the law, till all be fulfilled. 19 Whosoever therefore shall break one of these least commandments, and shall teach men so, he shall be called the least in the kingdom of heaven: but whosoever shall do and teach them, the same shall be called great in the kingdom of heaven. 20 For I say unto you, that except your righteousness shall exceed the righteousness of the scribes and Pharisees, ye shall in no case enter into the kingdom of heaven.

### Matthew 22:34-40

34 But when the Pharisees had heard that he had put the Sadducees to silence, they were gathered together. 35 Then one of them, which was a lawyer, asked him a question, tempting him, and saying, 36 Master, which is the great commandment in the law? 37 Yahshua said unto him, Thou shalt love Yahweh thy God with all thy heart, and with all thy soul, and with all thy mind. 38 This is the first and great commandment. 39 And the second is like unto it, Thou shalt love thy fellow kin as thyself. 40 On these two commandments hang all the law and the prophets.

### John 14:15

15 If ye love me, keep my commandments.

### John 15:10

10 If ye keep my commandments, ye shall abide in my love; even as I have kept my Father's commandments, and abide in his love.

### Leviticus 23

#### Feasts of Yahweh

1 And Yahweh spake unto Moses, saying, 2 Speak unto the children of Israel, and say unto them, Concerning the feasts of Yahweh, which ye shall proclaim to be holy convocations, even these are my feasts. 

#### The Sabbath

3 Six days shall work be done: but the seventh day is the sabbath of rest, an holy convocation; ye shall do no work therein: it is the sabbath of Yahweh in all your dwellings. 

#### The Passover

4 These are the feasts of Yahweh, even holy convocations, which ye shall proclaim in their seasons. 5 In the fourteenth day of the first month at even is Yahweh's passover. 6 And on the fifteenth day of the same month is the feast of unleavened bread unto Yahweh: seven days ye must eat unleavened bread. 7 In the first day ye shall have an holy convocation: ye shall do no servile work therein. 8 But ye shall offer an offering made by fire unto Yahweh seven days: in the seventh day is an holy convocation: ye shall do no servile work therein. 

#### The Feast of Firstfruits

9 And Yahweh spake unto Moses, saying, 10 Speak unto the children of Israel, and say unto them, When ye be come into the land which I give unto you, and shall reap the harvest thereof, then ye shall bring a sheaf of the firstfruits of your harvest unto the priest: 11 And he shall wave the sheaf before Yahweh, to be accepted for you: on the morrow after the sabbath the priest shall wave it. 12 And ye shall offer that day when ye wave the sheaf an he lamb without blemish of the first year for a burnt offering unto Yahweh. 13 And the meat offering thereof shall be two tenth deals of fine flour mingled with oil, an offering made by fire unto Yahweh for a sweet savour: and the drink offering thereof shall be of wine, the fourth part of an hin. 14 And ye shall eat neither bread, nor parched corn, nor green ears, until the selfsame day that ye have brought an offering unto your God: it shall be a statute for ever throughout your generations in all your dwellings. 

#### The Feast of Weeks

15 And ye shall count unto you from the morrow after the sabbath, from the day that ye brought the sheaf of the wave offering; seven sabbaths shall be complete: 16 Even unto the morrow after the seventh sabbath shall ye number fifty days; and ye shall offer a new meat offering unto Yahweh. 17 Ye shall bring out of your habitations two wave loaves of two tenth deals: they shall be of fine flour; they shall be baken with leaven; they are the firstfruits unto Yahweh. 18 And ye shall offer with the bread seven lambs without blemish of the first year, and one young bullock, and two rams: they shall be for a burnt offering unto Yahweh, with their meat offering, and their drink offerings, even an offering made by fire, of sweet savour unto Yahweh. 19 Then ye shall sacrifice one kid of the goats for a sin offering, and two lambs of the first year for a sacrifice of peace offerings. 20 And the priest shall wave them with the bread of the firstfruits for a wave offering before Yahweh, with the two lambs: they shall be holy to Yahweh for the priest. 21 And ye shall proclaim on the selfsame day, that it may be an holy convocation unto you: ye shall do no servile work therein: it shall be a statute for ever in all your dwellings throughout your generations. 22 And when ye reap the harvest of your land, thou shalt not make clean riddance of the corners of thy field when thou reapest, neither shalt thou gather any gleaning of thy harvest: thou shalt leave them unto the poor, and to the stranger: I am Yahweh your God. 

#### The Feast of Trumpets

23 And Yahweh spake unto Moses, saying, 24 Speak unto the children of Israel, saying, In the seventh month, in the first day of the month, shall ye have a sabbath, a memorial of blowing of trumpets, an holy convocation. 25 Ye shall do no servile work therein: but ye shall offer an offering made by fire unto Yahweh. 

#### The Day of Atonement

26 And Yahweh spake unto Moses, saying, 27 Also on the tenth day of this seventh month there shall be a day of atonement: it shall be an holy convocation unto you; and ye shall afflict your souls, and offer an offering made by fire unto Yahweh. 28 And ye shall do no work in that same day: for it is a day of atonement, to make an atonement for you before Yahweh your God. 29 For whatsoever soul it be that shall not be afflicted in that same day, he shall be cut off from among his people. 30 And whatsoever soul it be that doeth any work in that same day, the same soul will I destroy from among his people. 31 Ye shall do no manner of work: it shall be a statute for ever throughout your generations in all your dwellings. 32 It shall be unto you a sabbath of rest, and ye shall afflict your souls: in the ninth day of the month at even, from even unto even, shall ye celebrate your sabbath. 

#### The Feast of Tabernacles

33 And Yahweh spake unto Moses, saying, 34 Speak unto the children of Israel, saying, The fifteenth day of this seventh month shall be the feast of tabernacles for seven days unto Yahweh. 35 On the first day shall be an holy convocation: ye shall do no servile work therein. 36 Seven days ye shall offer an offering made by fire unto Yahweh: on the eighth day shall be an holy convocation unto you; and ye shall offer an offering made by fire unto Yahweh: it is a solemn assembly; and ye shall do no servile work therein. 37 These are the feasts of Yahweh, which ye shall proclaim to be holy convocations, to offer an offering made by fire unto Yahweh, a burnt offering, and a meat offering, a sacrifice, and drink offerings, every thing upon his day: 38 Beside the sabbaths of Yahweh, and beside your gifts, and beside all your vows, and beside all your freewill offerings, which ye give unto Yahweh. 39 Also in the fifteenth day of the seventh month, when ye have gathered in the fruit of the land, ye shall keep a feast unto Yahweh seven days: on the first day shall be a sabbath, and on the eighth day shall be a sabbath. 40 And ye shall take you on the first day the boughs of goodly trees, branches of palm trees, and the boughs of thick trees, and willows of the brook; and ye shall rejoice before Yahweh your God seven days. 41 And ye shall keep it a feast unto Yahweh seven days in the year. It shall be a statute for ever in your generations: ye shall celebrate it in the seventh month. 42 Ye shall dwell in booths seven days; all that are Israelites born shall dwell in booths: 43 That your generations may know that I made the children of Israel to dwell in booths, when I brought them out of the land of Egypt: I am Yahweh your God. 44 And Moses declared unto the children of Israel the feasts of Yahweh.

### I Corinthians 5:7-8

7 Purge out therefore the old leaven, that ye may be a new lump, as ye are unleavened. For even Christ our passover is sacrificed for us: 8 Therefore let us keep the feast, not with old leaven, neither with the leaven of malice and wickedness; but with the unleavened bread of sincerity and truth.
