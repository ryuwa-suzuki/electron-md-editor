import { ipcMain } from 'electron'
import { getZennFile, saveZennFile, syncWithZenn } from './zenn'
export function initIpcMain () {
  syncWithZenn(ipcMain)
  getZennFile(ipcMain)
  saveZennFile(ipcMain)
}
