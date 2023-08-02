// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld(
  'api', {
    syncWithZenn: (zennDirPath: string) => ipcRenderer.invoke('sync-with-zenn', {zennDirPath}),
    getZennFile: (zennDirPath: string, label: string, file: string) => ipcRenderer.invoke('get-zenn-file', {zennDirPath, label, file}),
    saveZennFile: (zennDirPath: string, label: string, file: string, content: string) => ipcRenderer.invoke('save-zenn-file', {zennDirPath, label, file, content})
  }
)
