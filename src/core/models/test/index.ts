import db from "../../db"

class Test {
    private _table = 'tests'

    public async create(
        options: {
            testname: string,
            dataset: string, // Stringified JSON
            type: string, // ENUM types string value = app mode (defined in /src/config)
            sheets_total: number
        }
        ) {
            return db(this._table).insert(options).then()
    }

    public async loadById(id: number) {
        return db(this._table).select('*').where('id', id).then(row => row[0])
    }

    public async loadWithOptions(
            options: {
                // Pagination
                so: {
                    page: number,
                    rowsPerPage: number
                },
                // Filter
                like?: {
                    field: string,
                    value: string
                },
                appMode?: string
            }
        ) {
            if (!options.like || !options.appMode) {
                return db
                        .select('*')
                        .from(this._table)
                        .paginate({ perPage: options.so.rowsPerPage, currentPage: options.so.page })
                        .then(rows => rows)
            } else {
                return db
                        .select('*')
                        .from(this._table)
                        .whereRaw(`type = "${options.appMode ? options.appMode : ''}"`)
                        .whereLike(options.like.field, `%${options.like.value}%`)
                        .paginate({ perPage: options.so.rowsPerPage, currentPage: options.so.page })
                        .then(rows => rows)
            }
    }

    public async delete(id: number) {
        return db(this._table).where('id', id).del().then(rows => rows)
    }
}

const test = new Test()

export default test
