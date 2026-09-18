const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const outputDirectory = path.join(root, "dist");
const outputFile = path.join(outputDirectory, "planning.html");

const read = fileName => fs.readFileSync(path.join(root, fileName), "utf8");
const inlineForScript = source => source.replace(/<\/script/gi, "<\\/script");
const inlineForStyle = source => source.replace(/<\/style/gi, "<\\/style");

const html = read("index.html");
const css = read("styles.css");
const javascript = read("planning.js");
const favicon = fs.readFileSync(path.join(root, "favicon.svg")).toString("base64");

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

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputFile, standaloneHtml, "utf8");
console.log(`Fichier autonome créé : ${path.relative(root, outputFile)}`);
