const fs = require('fs').promises;
const path = require('path');

const createCategoryFolder = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath);
  }
};

const moveToCategoryFolder = async (sourcePath, destPath) => {
  const fileName = path.basename(sourcePath);
  const targetPath = path.join(destPath, fileName);
  try {
    await fs.rename(sourcePath, targetPath);
    return { success: true, message: `Moved ${fileName} to ${destPath}` };
  } catch (error) {
    return {
      success: false,
      message: `Error moving file ${fileName}: ${error}`,
    };
  }
};

module.exports={createCategoryFolder,moveToCategoryFolder};