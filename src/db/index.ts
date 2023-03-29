import { IDb } from "./index.interface"

export const useDatabase = (): IDb => {
    return window.db ? window.db : 'Database not declared or exposed in main world'
}
