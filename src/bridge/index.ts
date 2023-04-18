import { IModels } from "./index.interface"

export const useModels = (): IModels => {
    return window.models ? window.models : 'Models not declared or exposed in main world'
}
