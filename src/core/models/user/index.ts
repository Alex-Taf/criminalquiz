import db from "../../db"

class User {
    private _table = 'users'

    public async create(options: { login: string, username: string, password: string }) {
        return db(this._table).insert(options).then()
    }

    public async getUserBy(entity: string, value: string) {
        return db.select('*').from(this._table).where(entity, value).then(rows => rows[0])
    }
}

const user = new User()

export default user
