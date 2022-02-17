{-
version 0.2

This is my first truly useful Haskell program!
Praise be to Yahweh, in the Name of Yahshua Messiah!!!
-}

modules = [
  "utils/u-manager",
  "utils/u-utils",
  "utils/u-MaryMessage",
  "utils/u-MaryDom",
  "model/m-vars",
  "model/m-calendar",
  "view/v-modals",
  "view/v-css",
  "view/v-main",
  "view/v-settings",
  "view/v-license",
  "view/v-commons",
  "control/c-main",
  "control/c-initialize"
  ]

outputPath = "../MaryCalendar.js"
wrapperHead = "(function MaryCalendar() {\n\n\"use strict\";\n\n"
wrapperTail = "}());\n"

appendModule path = do
  file <- readFile (path ++ ".js")
  appendFile outputPath (file ++ "\n")

main = do
  license <- readFile "license.js"
  writeFile outputPath (license ++ "\n")
  appendFile outputPath wrapperHead
  sequence_ [appendModule x | x <- modules]
  appendFile outputPath wrapperTail
  return ()