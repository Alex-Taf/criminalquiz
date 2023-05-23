<script setup lang="ts">
    import { onMounted, ref, watchEffect } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useStore } from '../store/index'
    import { Objectify, saveReportAs } from "../utils"
    import { useRouter } from "vue-router"

    const router = useRouter()

    const store = useStore()

    const { sheetActive, currentTest, mode } = storeToRefs(store)

    const activeNum = ref(1)
    const report = ref('')
    const isDone = ref(false)

    const changeActiveQuestion = (num: number) => {
        if (num === -1) isDone.value = true
        if (num !== -1) activeNum.value = num

        if (!isDone.value) {
            /* Reload init pipeline */
            store.loadTestsPipeline().then(() => {
                if (!store.isTestInPipeline(currentTest.value.id)) {
                    store.saveQuizToLocalPipeline({
                        testId: currentTest.value.id,
                        testname: currentTest.value.testname,
                        mode: mode.value,
                        sheetActive: Objectify(sheetActive.value, 'JSON'),
                        state: {
                            activeNum: activeNum.value,
                            isDone: isDone.value
                        }
                    })
                } else {
                    store.updateQuizInLocalPipeline({
                        testId: currentTest.value.id,
                        testname: currentTest.value.testname,
                        mode: mode.value,
                        sheetActive: Objectify(sheetActive.value, 'JSON'),
                        state: {
                            activeNum: activeNum.value,
                            isDone: isDone.value
                        }
                    })
                }
            })
        } else {
            store.deleteTestFromPipeline(currentTest.value.id)
        }
    }

    const findQuestionLabel = () => {
        return sheetActive.value.find((q) => q.num === activeNum.value).question
    }

    const getActiveVariants = () => {
        const variants = sheetActive.value.find(question => question.num === activeNum.value).variants
        
        if (variants[0] === -1) {
            isDone.value = true
            return
        }

        return sheetActive.value.find(question => question.num === activeNum.value).variants
    }

    // Init
    onMounted(() => {
        if (store.isTestInPipeline(currentTest.value.id)) {
            const state = store.loadStateFromPipeline(currentTest.value.id)

            activeNum.value = state.activeNum
            isDone.value = state.isDone
        }
    })

    watchEffect(() => {
        console.log(sheetActive)
    })
</script>

<template>
    <section class="tw-flex tw-flex-col tw-max-h-[700px] tw-w-[700px]">
        <span v-if="!isDone" class="tw-self-start tw-text-xl tw-text-left tw-mb-10">{{ findQuestionLabel() }}</span>
        <template v-if="!isDone">
            <section class="tw-grid tw-grid-rows-2 tw-grid-cols-2 tw-gap-4">
                <template v-for="(variant, index) in getActiveVariants()">
                    <v-card
                        v-if="!isDone"
                        color="blue"
                        class="!tw-p-3 tw-font-semibold"
                        :class="{ 'tw-col-span-2': index === getActiveVariants().length - 1 }"
                        @click="changeActiveQuestion(variant)"
                    >
                        {{ sheetActive.find(question => question.num === variant).question }}
                    </v-card>
                </template>
            </section>
        </template>
        <template v-if="isDone">
            <section class="report-area">
                <v-textarea
                    class="mb-4"
                    v-model="report"
                    label="Впишите данные в отчёт"
                ></v-textarea>
                <v-btn @click="saveReportAs(report)">Сохранить отчёт</v-btn>
                <v-btn @click="router.push({ path: '/' })">Завершить</v-btn>
            </section>
        </template>
    </section>
</template>

<!-- <style scoped>
    .trainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    h1 {
        margin-bottom: 3rem;
        width: 500px;
    }

    .answers {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .answers section {
        width: 600px;
    }

    .btn {
        display: flex;
        width: 100%;
        margin-bottom: 1rem;
        align-self: center;
    }

    .report-area {
        display: flex;
        flex-direction: column;
    }
</style> -->
