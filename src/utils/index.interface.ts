export interface IGetInitials {
    (words: string, options?: { uppercase?: boolean, dotted?: boolean } = { uppercase: false, dotted: false }): string
}

export interface IGetEstimationColor {
    (estimation: number): string | undefined
}

export interface ICalculatePages {
    (total: number, perPage: number): number
}
