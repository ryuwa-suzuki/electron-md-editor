// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld(
  'api', {
    syncWithZenn: () => ipcRenderer.invoke('sync-with-zenn'),
    getZennFile: (label: string, file: string) => ipcRenderer.invoke('get-zenn-file', {label, file}),
    saveZennFile: (label: string, file: string, content: string) => ipcRenderer.invoke('save-zenn-file', {label, file, content})
  }
)
