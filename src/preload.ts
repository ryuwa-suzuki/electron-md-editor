// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld(
  'api', {
    syncWithZenn: (zennDirPath: string) => ipcRenderer.invoke('sync-with-zenn', {zennDirPath}),
    getZennContent: (zennDirPath: string, label: string, file: string) => ipcRenderer.invoke('get-zenn-content', {zennDirPath, label, file}),
    saveZennFile: (zennDirPath: string, label: string, file: string, content: string) => ipcRenderer.invoke('save-zenn-file', {zennDirPath, label, file, content}),
    uploadImage: (zennDirPath: string, imagePath: string) => ipcRenderer.invoke('upload-image', {zennDirPath, imagePath})
  }
)
