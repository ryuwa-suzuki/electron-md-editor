import { ipcMain } from 'electron'
import { getZennFile, saveZennFile, syncWithZenn, uploadImage } from './zenn'
export function initIpcMain () {
  syncWithZenn(ipcMain)
  getZennFile(ipcMain)
  saveZennFile(ipcMain)
  uploadImage(ipcMain)
}
