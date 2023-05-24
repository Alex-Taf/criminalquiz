import { join } from "path"
import knex from "knex"
import { attachPaginate } from "knex-paginate"
attachPaginate()

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

/** */
/* Sqlite Database QueryBuilder declaration  */
/** */
const db = knex({
    client: 'sqlite3',
    connection: {
      filename: isDev ? join(__dirname, '../../../resources/db/cq.db') : join(__dirname, '../../../resources/db/cq.db').replace('/app.asar', '')
    }
})

export default db
