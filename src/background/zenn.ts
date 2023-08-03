import fs from 'fs';
import path from 'path';

export function syncWithZenn (ipcMain: Electron.IpcMain) {
  ipcMain.handle('sync-with-zenn', async (e, {zennDirPath}) => {
    if (!fs.existsSync(zennDirPath)) throw new Error('no-content');

    let articles = {};
    if (fs.existsSync(path.join(zennDirPath, 'articles'))) {
      articles = fs.readdirSync(path.join(zennDirPath, 'articles')).filter(file => file.endsWith('.md'));
    }

    let books = {};
    if (fs.existsSync(path.join(zennDirPath, 'books'))) {
      const booksDirs = fs.readdirSync(path.join(zennDirPath, 'books')).filter(file => {
        const filePath = path.join(zennDirPath, 'books', file);
        const stats = fs.statSync(filePath);

        return stats.isDirectory();
      });

      books = booksDirs.map((dirName) => {
        const bookfiles = fs.readdirSync(path.join(zennDirPath, 'books', dirName)).filter(file => file.endsWith('.md'));
        return {
          bookName: dirName,
          files: bookfiles
        }
      })
    }

    return {
      articles: articles,
      books: books
    }
  })
}

export function getZennFile (ipcMain: Electron.IpcMain) {
  ipcMain.handle('get-zenn-file', async (e, {zennDirPath, label, file}) => {
    let fileDirPath = '';
    if (label === 'articles') {
      fileDirPath = path.join(zennDirPath, 'articles');
    } else {
      fileDirPath = path.join(zennDirPath, 'books', label);
    }

    if (fs.existsSync(path.join(fileDirPath, file))) {
      return fs.readFileSync(path.join(fileDirPath, file), 'utf8').toString()
    }

    throw new Error('Failed to read file');
  })
}

export function saveZennFile(ipcMain: Electron.IpcMain) {
  ipcMain.handle('save-zenn-file', async (e, {zennDirPath, label, file, content }) => {
    let fileDirPath = '';
    if (label === 'articles') {
      fileDirPath = path.join(zennDirPath, 'articles');
    } else {
      fileDirPath = path.join(zennDirPath, 'books', label);
    }

    try {
      fs.writeFileSync(path.join(fileDirPath, file), content, 'utf8');
      return;
    } catch (error) {
      throw new Error('Failed to save file');
    }
  });
}

export function uploadImage(ipcMain: Electron.IpcMain) {
  ipcMain.handle('upload-image', async (e, {zennDirPath, imagePath }) => {
    const distPath = path.join(zennDirPath, 'images');
    const imageName = path.basename(imagePath);
    const uploadImagePath = path.join(distPath, imageName)

    try {
      if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
      }

      fs.copyFileSync(imagePath, uploadImagePath)

      return imageName;
    } catch (error) {
      throw new Error(error);
    }
  });
}
