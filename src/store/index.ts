import { defineStore } from 'pinia';
import router from "../router";
import { read, utils } from 'xlsx';
import { IUserData } from "../interfaces"
import { getFilename } from "../utils"
import { useDatabase } from "../db"

const $db = useDatabase()

export const useStore = defineStore({
    id: 'main',
    state: () => ({
        appMode: '',
        user: {} as IUserData,
        data: {},
        parsedData: {},
        dataset: [] as any,
        allTests: [] as any,
        sheetsTotal: 0 as number,
        allTestsNames: [] as any,
        currentTest: {} as any,
        activeSheet: [] as any,
        activeQuestion: {} as any,
        userEstimationsData: [] as any
    }),
    getters: {
        mode: (state) => state.appMode,
        wb: (state) => state.dataset,
        sheetsTotalCount: (state) => state.sheetsTotal,
        sheetActive: (state) => state.activeSheet,
        testsNames: (state) => state.allTestsNames,
        test: (state) => state.currentTest,
        userData: (state) => state.user,
        userEstimations: (state) => state.userEstimationsData
    },
    actions: {
        async loadTestsFromFile(e: Event, options?: { loadInDb?: boolean }) {
            if (e) {
                /* Reading a file from event handler */
                this.data = await e?.target?.files[0].arrayBuffer();
                    
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

                const ds = sheets.map((sheet) => {
                    return sheet.map((question) => {
                        const keyValues = Object.keys(question).map(key => {
                            const newKey = replacements[key] || key;
                            return { [newKey]: question[key] };
                          });

                        const newObject = Object.assign({}, ...keyValues);

                        return newObject;
                    })
                })

                const st = sheets.length

                if (options && options.loadInDb) {
                    $db.insert('tests', {
                        testname: getFilename(e?.target?.files[0].name),
                        dataset: JSON.stringify(ds),
                        type: this.appMode,
                        sheets_total: st 
                    }).finally(() => {
                        router.push({ path: '/choosedb' })
                    })
                } else {
                    this.dataset = ds
                    this.sheetsTotal = st
                }
            }
        },
        chooseSheet(num: number) {
            const currentDataset = this.dataset[num]
            const newCurr = currentDataset.map((q) => {
                const variants = Object.fromEntries(
                    Object.entries(q)
                    .filter(
                        ([key, value]) => key.includes('var') && !isNaN(value as number)));
                    
                Object.defineProperty(q, 'variants', {
                    value: Object.values(variants),
                    writable: true
                })

                return q
            })

            this.activeSheet = newCurr
        },
        chooseMode(mode: string) {
            this.appMode = mode
        },
        chooseTest(testNum: number) {
            this.currentTest = this.allTests[testNum]
            this.sheetsTotal = this.currentTest.sheets_total
            this.dataset = JSON.parse(this.currentTest.dataset)
            router.push({ path: '/choose' })
        },
        loadTests() {
            $db
            .selectWhere('*', 'tests', `type = "${this.appMode}"`)
            .then(result => {
                console.log(result)
                this.allTests = result
                this.allTestsNames = this.allTests.map((row) => {
                    return row.testname
                })
                router.push({ path: '/choosedb' })
            })
        },
        doneQuiz(
            data: {
                userId: number,
                testId: number,
                resultEstimation: number
            }) {
                
                $db
                .selectWhere('id', 'estimations', `estimation = "${data.resultEstimation}"`)
                .then(result => {
                    $db.insert('users_estimations', {
                        user_id: data.userId,
                        test_id: data.testId,
                        estimation_id: result[0].id
                    })
                })
            },
        loadUserEstimations(userId: number) {
            // $db
            // .selectWhere('*', 'users_estimations', ``)
            // .then(row => {
            //     $db.
            // })
        }
    }
})
