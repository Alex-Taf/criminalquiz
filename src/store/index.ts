import { defineStore } from 'pinia';
import { read, utils } from 'xlsx';

export const useStore = defineStore({
    id: 'main',
    state: () => ({
        data: {},
        parsedData: {},
        workbook: [] as any,
        workbookSheetsTotal: 0 as number,
        activeSheet: [] as any,
        activeQuestion: {} as any
    }),
    getters: {
        wb: (state) => state.workbook,
        sheetsTotal: (state) => state.workbookSheetsTotal,
        sheetActive: (state) => state.activeSheet
    },
    actions: {
        async handleFileAsync(e: Event) {
            if (e && e[0]) {
                /* Reading a file from event handler */
                this.data = await e[0].arrayBuffer();
                    
                /* data is an ArrayBuffer */
                this.parsedData = read(this.data);
                
                /* DO SOMETHING WITH workbook HERE */
                // this.workbook = utils.sheet_to_json(this.parsedData.Sheets[this.parsedData.SheetNames[0]])
                let sheets = []

                for (let i = 0; i < this.parsedData.SheetNames.length; i++) {
                    sheets.push(utils.sheet_to_json(this.parsedData.Sheets[this.parsedData.SheetNames[i]]))
                }

                const replacements = {
                    '№': 'num',
                    'Вопросы': 'question',
                    'Вопрос': 'question',
                    'Варианты ответов': 'var1',
                    'Ответы': 'var1',
                    '__EMPTY': 'var2',
                    '__EMPTY_1': 'var3',
                    '__EMPTY_2': 'var4',
                    '__EMPTY_3': 'var5',
                    '__EMPTY_4': 'var6',
                    '__EMPTY_5': 'var7',
                    '__EMPTY_6': 'var8',
                    '__EMPTY_7': 'var9',
                    '__EMPTY_8': 'var10',
                    '__EMPTY_9': 'var11',
                    '__EMPTY_10': 'var12',
                    '__EMPTY_11': 'var13',
                    '__EMPTY_12': 'var14',
                    '__EMPTY_13': 'var15',
                    '__EMPTY_14': 'var16',
                    '__EMPTY_15': 'var17',
                    '__EMPTY_16': 'var18',
                    '__EMPTY_17': 'var19',
                }

                this.workbook = sheets.map((sheet) => {
                    return sheet.map((question) => {
                        const keyValues = Object.keys(question).map(key => {
                            const newKey = replacements[key] || key;
                            return { [newKey]: question[key] };
                          });

                        const newObject = Object.assign({}, ...keyValues);
                        const variants = Object.fromEntries(Object.entries(newObject).filter(([key]) => key.includes('var')));

                        Object.defineProperty(newObject, 'variants', {
                            value: Object.values(variants),
                            writable: true
                        })

                        return newObject;
                    })
                })
                
                this.workbookSheetsTotal = sheets.length
            }
        },
        chooseSheet(num: number) {
            this.activeSheet = this.workbook[num]
        }
    }
})