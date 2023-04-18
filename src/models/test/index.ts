import db from "../../db"

class Test {
    private _table = 'tests'

    public async create(
        options: {
            testname: string,
            dataset: string, // Stringified JSON
            type: string, // ENUM types string value = app mode
            sheets_total: number
        }
        ) {
            return db(this._table).insert(options).then()
    }

    public async loadByAppMode(appMode: string) {
        return db(this._table)
            .whereRaw(`type = "${appMode}"`)
            .select('*')
            .then(rows => rows)
    }

    public async loadWithOptions(
        // Pagination
        so: {
            page: number,
            rowsPerPage: number
        },
        // Filter
        like?: {
            field: string,
            value: string
        }
        ) {
            if (!like) {
                return db
                        .select('id', 'testname')
                        .from(this._table)
                        .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
                        .then(rows => rows)
            } else {
                return db
                        .select('id', 'testname')
                        .from(this._table)
                        .whereLike(like.field, `%${like.value}%`)
                        .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
                        .then(rows => rows)
            }
    }

    public async delete(id: number) {
        return db(this._table).where('id', id).del().then(rows => rows)
    }
}

const test = new Test()

export default test
