export interface IDbRowGeneric {
    length: number,
    result: Array<Record<string | number, string | number>>
}

export interface IDb {
    select: (entity: string, table: string) => Promise<IDbRowGeneric>,
    selectWhere: (entity: string, table: string, where: string) => Promise<IDbRowGeneric>,
    insert: (table: string, options: Record<string | number, string | number>) => Promise<IDbRowGeneric>, // procedure
    join: (
        table: string,
        options: {
        joinedTable: string,
            entities: Array<string>,
            operator: string
        },
        selection: Array<string>,
        where?: string
    ) => Promise<IDbRowGeneric>,
    intermediateJoin: (
        selectValues: [],
        table1: string,
        interTable: {
            name: string,
            values: string[],
            operator: string
        },
        table3: {
            name: string,
            values: string[],
            operator: string
        }
    ) => Promise<IDbRowGeneric>
}
