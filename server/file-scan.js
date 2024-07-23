const fs = require('fs').promises;
const path = require('path');

const { createCategoryFolder, moveToCategoryFolder } = require('./utility');

const fetchFileCategory = (fileName, fileSize) => {
  const fileExt = path.extname(fileName).toLowerCase();
  const sizeInMB = fileSize / (1024 * 1024);

  if (
    sizeInMB > 800 &&
    (fileExt === '.mp3' || fileExt === '.mkv' || fileExt === '.mp4')
  ) {
    return 'Movies';
  }

  switch (fileExt) {
    case '.pdf':
      return 'PDFs';
    case '.rar':
    case '.zip':
    case '.7z':
      return 'ZIPs';
    case '.ppt':
    case '.pptx':
      return 'PPTs';
    case '.jpg':
    case '.jpeg':
    case '.png':
      return 'Images';
    case '.doc':
    case '.docx':
    case '.txt':
      return 'DOCs';
    case '.xlsx':
      return 'Excels';
    case '.mp3':
    case '.wav':
      return 'Audios';
    case '.mp4':
    case '.avi':
    case '.mkv':
    case '.mov':
      return 'Videos';
    default:
      return 'Other';
  }
};

const scanDirectory = async (dirPath, res) => {
  dirPath = path.normalize(dirPath); // Normalize path format
  dirPath = path.resolve(dirPath); // Resolve to an absolute path
  try {
    const files = await fs.readdir(dirPath);
    if (files.length === 0) {
      res.send({ success: false, message: 'No files to categorize' });
      return;
    }

    let hasErrors = false;

    for (const file of files) {
      const fileFullPath = path.join(dirPath, file);
      try {
        const stats = await fs.stat(fileFullPath);
        if (stats.isFile()) {
          const category = fetchFileCategory(file, stats.size);
          const targetDir = path.join(dirPath, category);
          await createCategoryFolder(targetDir);
          const result = await moveToCategoryFolder(fileFullPath, targetDir);
          if (!result.success) {
            hasErrors = true;
          }
        }
      } catch (err) {
        res.send({ success: false, message: `Error in file stats: ${err}` });
        return;
      }
    }

    if (hasErrors) {
      res.send({ success: false, message: 'Some files could not be moved' });
    } else {
      res.send({ success: true, message: 'All files are categorized' });
    }
  } catch (err) {
    res.send({ success: false, message: `Error in reading folder: ${err}` });
  }
};

module.exports = { scanDirectory };
