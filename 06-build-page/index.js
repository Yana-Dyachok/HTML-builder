const fs = require("fs");
const path = require("path");

const projectPath = path.join(__dirname, "project-dist");
const assetsPath = path.join(__dirname, "assets");
const assetCopyPath = path.join(projectPath, "assets");
const compPath = path.join(__dirname, "components");
const stylesPath = path.join(__dirname, "styles");
const newStylePath = path.join(projectPath, "style.css");
const tempPath=path.join(__dirname, "template.html")
createDirectory();
copyAssets(assetsPath, assetCopyPath);
createStyles();
getHtmlFile();
async function createDirectory() {
  try {
    await fs.promises.mkdir(projectPath, { recursive: true });
  } catch (error) {
    console.log(error);
  }
}

async function copyAssets(pathFile, pathCopy) {
  try {
    await fs.promises.mkdir(pathCopy, { recursive: true });
    const files = await fs.promises.readdir(pathFile, { withFileTypes: true });
    for (let file of files) {
      const subPathFile = path.join(pathFile, file.name);
      const subPathCopy = path.join(pathCopy, file.name);
      if (!file.isFile()) {
        await copyAssets(subPathFile, subPathCopy);
      } else {
        await fs.promises.copyFile(subPathFile, subPathCopy);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function createStyles() {
  try {
    const files = await fs.promises.readdir(stylesPath);

    const cssFiles = files.filter((file) => path.extname(file) === ".css");

    const cssData = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesPath, file);
        const fileData = await fs.promises.readFile(filePath, "utf8");
        return fileData;
      })
    );

    const styleData = cssData.join("\n");

    await fs.promises.writeFile(newStylePath, styleData, "utf8");
  } catch (error) {
    console.error(error);
  }
}

async function getHtmlFile() {
  try {
    const temp = fs.createReadStream(tempPath,"utf-8");
    const result = fs.createWriteStream(path.join(projectPath, "index.html"));
    let str = " ";

    temp.on("data", async (data) => {
      str += data.toString();
    });

    temp.on("end", async () => {
      function mapper(res) {
        return `{{${res}}}`;
      }
      const component = await fs.promises.readdir(compPath, {withFileTypes: true,});

      for (const el of component) {
        const fileName = el.name.match(/([\w]*\.)*/)[0].replace('.', '');
        const compPlaceholder = mapper(fileName);
        const componentPath = path.join(compPath, el.name);
        const compData = await fs.promises.readFile(componentPath,"utf-8");
        str = str.replace(compPlaceholder, compData);
      }
      result.write(str);
      result.end();
    });
  } catch (error) {
    console.error(error);
    return
  }
  console.log('HTML file is ready')
}