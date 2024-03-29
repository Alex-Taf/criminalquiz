import { defineStore } from 'pinia';
import router from "../router";
import { read, utils } from 'xlsx';
import { IUserData } from "../interfaces"
import { LocalPipeline, Objectify, getFilename } from "../utils"
import { useModels } from "../bridge"
import { ServerOptions } from "vue3-easy-data-table"

const $models = useModels()
const lp = new LocalPipeline()

export const useStore = defineStore({
    id: 'main',
    state: () => ({
        appMode: '',
        user: {} as IUserData,
        data: {},
        parsedData: {},
        dataset: [] as any,
        allTests: [] as any,
        testsTotal: 0,
        estimationsTotal: 0,
        sheetsTotal: 0,
        allTestsNames: [] as any,
        currentTest: {} as any,
        activeSheet: [] as any,
        activeQuestion: {} as any,
        userEstimationsData: [] as any,
        testsPipeline: []
    }),
    getters: {
        mode: (state) => state.appMode,
        wb: (state) => state.dataset,
        sheetsTotalCount: (state) => state.sheetsTotal,
        sheetActive: (state) => state.activeSheet,
        tests: (state) => state.allTests,
        total: (state) => state.testsTotal,
        estTotal: (state) => state.estimationsTotal,
        testsNames: (state) => state.allTestsNames,
        test: (state) => state.currentTest,
        userData: (state) => state.user,
        userEstimations: (state) => state.userEstimationsData,
        pipeline: (state) => state.testsPipeline
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
                let sheets: Array<{ idx: number, item: any }> = []

                for (let i = 0; i < this.parsedData.SheetNames.length; i++) {
                    sheets.push({
                        idx: i + 1,
                        item: utils.sheet_to_json(this.parsedData.Sheets[this.parsedData.SheetNames[i]])
                    })
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
                    return {
                        idx: sheet.idx,
                        item: sheet.item.map((question) => {
                            const keyValues = Object.keys(question).map(key => {
                                const newKey = replacements[key] || key;
                                return { [newKey]: question[key] };
                              });
    
                            const newObject = Object.assign({}, ...keyValues);
    
                            return newObject;
                        })
                    }
                })

                const st = sheets.length

                if (options && options.loadInDb) {
                    $models.test.create({
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
            const currentDataset = this.dataset[num].item
            console.log(currentDataset)
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
            this.currentTest = this.allTests[testNum].row || this.allTests[testNum] 
            this.sheetsTotal = this.currentTest.sheets_total
            this.dataset = JSON.parse(this.currentTest.dataset)
            router.push({ path: '/choose' })
        },
        async saveQuizToLocalPipeline(data: {
            testId: number,
            testname: string,
            mode: string,
            sheetActive: any,
            state: any
        }) {
            lp.save("testsPipeline", data)
        },
        async updateQuizInLocalPipeline(data: {
            testId: number,
            testname: string,
            mode: string,
            sheetActive: any,
            state: any
        }) {
            lp.update("testsPipeline", data)
        },
        async loadTestsPipeline() {
            const tests = await lp.load("testsPipeline")
            const occurences = await $models.test.entries(tests.map(test => test.testId))

            this.testsPipeline = tests.filter(test => occurences.some(occ => occ.id === test.testId))
            const notEntry = tests.filter(test => !occurences.some(occ => occ.id === test.testId))
            
            if (notEntry.length > 0) {
                notEntry.forEach(item => {
                    lp.delete("testsPipeline", item.testId)
                })
            }
        },
        loadTestFromPipeline(id: number) {
            $models
            .test
            .loadById(id)
            .then(result => {
                const currentTest = this.testsPipeline.find((test) => test.testId === id)

                this.appMode = currentTest.mode
                this.currentTest = result
                this.sheetsTotal = result.sheets_total
                this.dataset = JSON.parse(result.dataset)

                const newCurr = this.dataset[0].item.map((q) => {
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
                
                if (this.appMode === 'quiz') router.push({ path: '/quiz' })
                if (this.appMode === 'trainer') router.push({ path: '/trainer' })
            })
        },
        loadStateFromPipeline(id: number) {
            const currentTest = this.testsPipeline.find((test) => id === test.testId)
            return currentTest.state
        },
        deleteTestFromPipeline(id: number) {
            lp.delete("testsPipeline", id)
        },
        isTestInPipeline(id: number) {
            console.log(Objectify(this.testsPipeline, 'JSON'))
            console.log(Objectify(this.testsPipeline, 'JSON').some(test => test.testId === id))
            return Objectify(this.testsPipeline, 'JSON').some(test => test.testId === id)
        },
        async loadTestsByAppMode(so: ServerOptions, like?: { field: string, value: string }) {
            $models
                .test
                .loadWithOptions({
                    so: {
                        page: so.page,
                        rowsPerPage: so.rowsPerPage
                    },
                    like: {
                        field: like?.field,
                        value: like?.value
                    },
                    appMode: this.appMode
                }).then(result => {
                    this.allTests = result.data.map((row, index) => {
                        return {
                            idx: index + result.pagination.from + 1,
                            row
                        }
                    })

                    this.allTestsNames = this.allTests.map((test) => {
                        return {
                            idx: test.idx,
                            testname: test.row.testname
                        }
                    })

                    if (so.page === 1) {
                        this.testsTotal = result.pagination.total
                    }
                })
        },
        async loadAllTests(so: ServerOptions, like?: { field: string, value: string }) {
            $models
                .test
                .loadWithOptions(
                    {
                        so: {
                            page: so?.page,
                            rowsPerPage: so?.rowsPerPage
                        },
                        like: {
                            field: like?.field,
                            value: like?.value
                        }
                    }
                )
                .then(result => {
                    this.allTests = result.data.map((row, index) => {
                        return {
                            idx: index + result.pagination.from + 1,
                            row
                        }
                    })

                    if (so.page === 1) {
                        this.testsTotal = result.pagination.total
                    }
                })
        },
        async purgeTest(id: number) {
            console.log(id)
            await $models.test.delete(id)
        },
        doneQuiz(
            data: {
                userId: number,
                testId: number,
                resultEstimation: number
            }) {

                $models
                    .estimation
                    .getIdByEstimation(data.resultEstimation)
                    .then(result => {
                        $models
                            .userEstimation
                            .create({
                                user_id: data.userId,
                                test_id: data.testId,
                                estimation_id: result[0].id
                            })
                    })
            },
        async loadUserEstimations(userId: number, so: ServerOptions, like?: { field: string, value: string }) {
            $models
                .userEstimation
                .load(
                    userId,
                    {
                        page: so?.page,
                        rowsPerPage: so?.rowsPerPage
                    },
                    {
                        field: like?.field,
                        value: like?.value
                    }
                    ).then(result => { 
                        this.userEstimationsData = result.data.map((value, index) => {
                            return {
                                num: index + 1,
                                testname: value.testname,
                                estimation: value.estimation
                            }
                        })
        
                        if (so?.page === 1) {
                            this.estimationsTotal = result.pagination.total
                        }
                    })
        }
    }
})
