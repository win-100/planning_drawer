const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const outputDirectory = path.join(root, "dist");
const outputFile = path.join(outputDirectory, "planning.html");
const versionFile = path.join(root, ".build-version");

const read = fileName => fs.readFileSync(path.join(root, fileName), "utf8");
const inlineForScript = source => source.replace(/<\/script/gi, "<\\/script");
const inlineForStyle = source => source.replace(/<\/style/gi, "<\\/style");

const nextBuildVersion = () => {
  if (!fs.existsSync(versionFile)) return "1.000";

  const previousVersion = fs.readFileSync(versionFile, "utf8").trim();
  const match = /^(\d+)\.(\d{3})$/.exec(previousVersion);
  if (!match) {
    throw new Error(`Version de build invalide : ${previousVersion}`);
  }

  const major = Number(match[1]);
  const minor = Number(match[2]) + 1;
  return `${major}.${String(minor).padStart(3, "0")}`;
};

const html = read("index.html");
const css = read("styles.css");
const javascript = read("planning.js");
const favicon = fs.readFileSync(path.join(root, "favicon.svg")).toString("base64");
const buildVersion = nextBuildVersion();

const replacements = [
  {
    source: '<link rel="icon" href="favicon.svg" type="image/svg+xml" />',
    target: `<link rel="icon" href="data:image/svg+xml;base64,${favicon}" type="image/svg+xml" />`
  },
  {
    source: '<link rel="stylesheet" href="styles.css" />',
    target: `<style>\n${inlineForStyle(css)}\n</style>`
  },
  {
    source: '<script src="planning.js"></script>',
    target: `<script>\n${inlineForScript(javascript)}\n</script>`
  }
];

const standaloneHtml = replacements.reduce((document, { source, target }) => {
  if (!document.includes(source)) {
    throw new Error(`Référence introuvable dans index.html : ${source}`);
  }
  return document.replace(source, target);
}, html);

const standaloneHtmlWithVersion = standaloneHtml.replace(
  "<!DOCTYPE html>",
  `<!DOCTYPE html>\n<!-- Version de build : ${buildVersion} -->`
);

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputFile, standaloneHtmlWithVersion, "utf8");
fs.writeFileSync(versionFile, `${buildVersion}\n`, "utf8");
console.log(`Fichier autonome créé : ${path.relative(root, outputFile)} (version ${buildVersion})`);
