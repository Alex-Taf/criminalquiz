import { toRaw } from 'vue'
import { OBJECTIFY_MODES } from '../config/index'

export const Objectify = (target: any, type: string) => {
    if (type === OBJECTIFY_MODES.JSON) return JSON.parse(JSON.stringify(target))
    if (type === OBJECTIFY_MODES.Proxy) return toRaw(target)
}
