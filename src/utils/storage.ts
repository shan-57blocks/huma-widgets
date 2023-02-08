import { logError } from './ddLogger'

export const ChoosenProvider = 'chosenProvider'

const getStorage = (storage: Storage) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setItem(key: string, val: any) {
    let strVal = val
    if (typeof val === 'object') {
      strVal = JSON.stringify(val)
    }
    storage.setItem(key, strVal)
  },
  getItem<T>(key: string) {
    const val = storage.getItem(key)
    if (val === null) {
      return val
    }
    try {
      return JSON.parse(val) as T
    } catch (error) {
      logError(error)
      return val
    }
  },
  removeItem(key: string) {
    storage.removeItem(key)
  },
})

const local = getStorage(window.localStorage)
const session = getStorage(window.sessionStorage)

export { local, session }
