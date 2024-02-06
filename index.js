const core = require("@actions/core");
const fs = require("fs");

run();

function run() {
  try {
    const filePath = core.getInput("path");
    let md = fs.readFileSync(filePath, "utf-8");

    md = replaceHeadings(md);
    md = replaceImportant(md);

    core.info(md);
    core.setOutput("markdown", cleanStringForBash(createHead(md)));
  } catch (error) {
    core.setFailed(error.message);
  }
}

function createHead(toParse) {
  const head = `---
title: ${core.getInput("title")}
thumbnail: ""
---

  `;

  return head.concat(toParse);
}

function cleanStringForBash(inputString) {
  // Escape single quotes, double quotes, and backticks
  const cleanedString = inputString.replace(/(['"`])/g, "\\$1");
  return cleanedString;
}

function replaceHeadings(toParse) {
  const regXHeading = /#{1,6}.+/g;
  const regXReplace = /#{1,6}./g;
  const matchArray = toParse.match(regXHeading);

  if (matchArray) {
    matchArray.forEach((element) => {
      const elementText = element.replace(regXReplace, "");

      toParse = toParse.replace(
        element,
        `:wordWave{text="${elementText}" link="false"}`
      );
    });
  }

  return toParse;
}

function replaceImportant(toParse) {
  const regXImportant = /\[!IMPORTANT\]/g;
  const MatchArray = toParse.match(regXImportant);

  if (MatchArray) {
    MatchArray.forEach((element) => {
      toParse = toParse.replace(regXImportant, "");
    });
  }

  return toParse;
}
