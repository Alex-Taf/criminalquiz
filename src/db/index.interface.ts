export interface IDbRowGeneric {
    length: number,
    result: Array<Record<string | number, string | number>>
}

export interface IDb {
    select: (entity: string, table: string) => Promise<IDbRowGeneric>,
    selectWhere: (entity: string, table: string, where: string) => Promise<IDbRowGeneric>,
    insert: (table: string, options: Record<string | number, string | number>) => Promise<IDbRowGeneric> // procedure
}
