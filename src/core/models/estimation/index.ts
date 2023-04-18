import db from "../../db"

class Estimation {
    private _table = 'estimations'

    public async getIdByEstimation(resultEstimation: number) {
        return db
                .select('id')
                .from(this._table)
                .whereRaw(`estimation = "${resultEstimation}"`)
    }
}

const estimation = new Estimation()

export default estimation
