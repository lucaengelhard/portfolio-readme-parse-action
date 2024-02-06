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
title: "${core.getInput("title").trim()}"
thumbnail: "${core.getInput("thumbnail").trim()}"
order: ${core.getInput("order").trim()}
---

${createTags()}

---

  `;

  return head.concat(toParse);
}

function createTags() {
  const tags = core.getInput("tags");
  const tagArray = tags.split(",");
  let stringArray = [];

  tagArray.forEach((tag) => {
    stringArray.push(`:wordWave{text="${tag.trim()}" link="false"}`);
  });

  return stringArray.join("\n");
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
        `:wordWave{text="${elementText.trim()}" link="false"}`
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
