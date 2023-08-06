import { ipcMain } from 'electron'
import { getZennContent, saveZennFile, syncWithZenn, uploadImage } from './zenn'
export function initIpcMain () {
  syncWithZenn(ipcMain)
  getZennContent(ipcMain)
  saveZennFile(ipcMain)
  uploadImage(ipcMain)
}
