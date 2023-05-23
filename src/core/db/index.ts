import { join } from "path"
import knex from "knex"
import { attachPaginate } from "knex-paginate"
attachPaginate()

/** */
/* Sqlite Database QueryBuilder declaration  */
/** */
const db = knex({
    client: 'sqlite3',
    connection: {
      filename: join(__dirname, '../../../resources/db/cq.db')
    }
})

export default db
