import db from "../../db"

class UserEstimation {
    private _interTable = 'users_estimations'

    public async create(options: {
        user_id: number,
        test_id: number,
        estimation_id: any
    }) {
        return db(this._interTable).insert(options).then()
    }

    public async load(
        userId: number,
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
                  .select('tests.testname', 'estimations.estimation')
                  .from('tests')
                  .where('users_estimations.user_id', userId)
                  .join(this._interTable, 'tests.id', '=', 'users_estimations.test_id')
                  .join('estimations', 'estimations.id', '=', 'users_estimations.estimation_id')
                  .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
                  .then(rows => rows)
          }
      
          if (like) {
            return db
                    .select('tests.testname', 'estimations.estimation')
                    .from('tests')
                    .where('users_estimations.user_id', userId)
                    .whereLike(like.field, `%${like.value}%`)
                    .join(this._interTable, 'tests.id', '=', 'users_estimations.test_id')
                    .join('estimations', 'estimations.id', '=', 'users_estimations.estimation_id')
                    .paginate({ perPage: so.rowsPerPage, currentPage: so.page })
                    .then(rows => rows)
          }
    }
}

const userEstimation = new UserEstimation()

export default userEstimation
