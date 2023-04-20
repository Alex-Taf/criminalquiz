interface IDbRowGeneric {
    length: number,
    result: Array<Record<string | number, string | number>>
}

export interface IModels {
    test: {
        create: (options: {
          testname: string,
          dataset: string, // Stringified JSON
          type: string, // ENUM types string value = app mode
          sheets_total: number
        }) => Promise<IDbRowGeneric>,
        loadByAppMode: (appMode: string) => Promise<IDbRowGeneric>,
        loadWithOptions: (
          options: {
            so: {
                page: number,
                rowsPerPage: number
            },
            like?: {
                field: string,
                value: string
            },
            appMode?: string
          }
        ) => Promise<IDbRowGeneric>,
        delete: (id: number) => Promise<IDbRowGeneric> 
      },
      estimation: {
        getIdByEstimation: (resultEstimation: number) => Promise<IDbRowGeneric>
      },
      userEstimation: {
        create: (options: {
          user_id: number,
          test_id: number,
          estimation_id: any
        }) => Promise<IDbRowGeneric>,
        load: (
          userId: number,
          so: {
              page: number,
              rowsPerPage: number
          },
          like?: {
              field: string,
              value: string
          }
        ) => Promise<IDbRowGeneric>
    }
}
