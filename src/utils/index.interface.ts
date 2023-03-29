export interface IGetInitials {
    (words: string, options?: { uppercase?: boolean, dotted?: boolean } = { uppercase: false, dotted: false }): string
}
