const core = require("@actions/core");
const github = require("@actions/github");

let md;

try {
  md = replaceHeadings(md);
  md = replaceImportant(md);
} catch (error) {
  core.setFailed(error.message);
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