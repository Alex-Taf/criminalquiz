<script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useStore } from '../store/index'
    import { useRouter } from "vue-router"
    import { Objectify, saveReportAs } from '../utils/index'
    import { userAPI } from '../http/user.api'

    const store = useStore()
    const router = useRouter()

    const { sheetActive, currentTest } = storeToRefs(store)

    const count = ref(0)
    const activeNum = ref(1)
    const questions = ref([])
    const currentQuestion = reactive({})
    const currentQuestionAnswers = ref([])
    const correctQuestionAnswers = ref([])
    const correctVariantsCount = ref(0)
    const selection = ref([])
    const questionsCount = ref(0)
    const score = ref(0)
    const result = ref(0)
    const quizDonePercent = ref('0%')
    const report = ref('')
    const isQuizDone = ref(false)

    const getQuestions = () => {
        questions.value = sheetActive.value.filter((question) => {
            return question.variants.length > 1
        })
    }

    const getCorrectVariants = () => {
        const answers = sheetActive.value.filter((question) => {
            return question.variants.length === 1
        })
        const correctAnswers = answers.map((answer) => {
            return {
                num: answer.num,
                question: answer.question,
                variants: answer.variants.filter((variant) => variant === 1)
            }
        }).filter((answer) => answer.variants.length > 0)
        
        correctVariantsCount.value = correctAnswers.length
    }

    const getQuestionAnswers = (answers: Array<number>) => {
        let ans = []
        
        answers.forEach((value) => {
            const q = sheetActive.value.find((question) => question.num === value)
            ans.push(q)
        })
        currentQuestionAnswers.value = ans
        correctQuestionAnswers.value = ans.filter((value: any) => value.variants[0] === 1).map((value) => value.num)
    }

    const getCurrentQuestion = () => {
        currentQuestion.value = questions.value.find((question) => question.num === activeNum.value)
    }

    const getQuestionVariants = () => {
        return questions.value.find((value: any) => value.num === activeNum.value).variants.map(value => value)
    }

    const getQuestionsCount = () => {
        questionsCount.value = questions.value.length
    }

    const handleAnswer = () => {
        selection.value.forEach(value => {
            if (correctQuestionAnswers.value.find((correct) => correct === value)) {
                score.value++
            }
        });
        selection.value = []
        
        count.value++
        activeNum.value = questions.value[count.value].num
        quizDonePercent.value = `${+(count.value / questionsCount.value).toFixed(2) * 100}%`
        
        getCurrentQuestion()
        getQuestionAnswers(getQuestionVariants())
    }


    const isDisabled = (currentSelection: any) => {
        return selection.value.length === correctQuestionAnswers.value.length && !selection.value.includes(currentSelection)
    }

    const isFinalQuestion = () => {
        const qArray = questions.value.map((value) => value)
        const qObject = Objectify(qArray[qArray.length - 1], 'Proxy')

        return qObject?.num === activeNum.value
    }

    console.log(+userAPI.storageUserData.id)

    const doneQuiz = () => {
        isQuizDone.value = true

        result.value = +(score.value / correctVariantsCount.value).toFixed(0) * 100
        report.value = `Результат за пройденный тест: ${result.value}%. Оценка: ${calculateEstimation()?.estimation}`
        
        store.doneQuiz({
            userId: +userAPI.storageUserData.id,
            testId: +currentTest.value.id,
            resultEstimation: calculateEstimation()?.estimation
        })
    }

    const calculateEstimation = () => {
        if (result.value < 30) return { estimation: 2, color: 'red' }
        if (result.value >= 30 && result.value < 70) return { estimation: 3, color: 'orange' }
        if (result.value >= 70 && result.value < 95) return { estimation: 4, color: 'yellow' }
        if (result.value >= 95) return { estimation: 5, color: 'green' }
    }

    // Init
    onMounted(() => {
        getQuestions()
        getQuestionsCount()
        getCurrentQuestion()
        getQuestionAnswers(getQuestionVariants())
        getCorrectVariants()
    })
</script>

<template>
    <div class="quiz-done-line"></div>
    <section class="quiz col">
        <h1 v-if="!isQuizDone">{{ currentQuestion.value?.question }}</h1>
        <div class="answers" v-if="!isQuizDone">
            <template v-for="answer in currentQuestionAnswers" :key="answer.num">
                <v-checkbox
                    v-model="selection"
                    :label="answer.question"
                    :value="answer.num"
                    :disabled="isDisabled(answer.num)"
                    class="answer-check"
                ></v-checkbox>
            </template>
            <v-btn v-if="!isFinalQuestion()" class="btn" @click="handleAnswer()">
                Далее
            </v-btn>
            <v-btn v-else @click="doneQuiz">
                Завершить
            </v-btn>
        </div>
        <template v-if="isQuizDone">
            <section class="report-area">
                <span class="report-area-result">
                    Ваш результат составляет {{ result }}%
                </span>
                <span class="report-area-estim" :style="{ color: calculateEstimation()?.color }">
                    {{ calculateEstimation()?.estimation }}
                </span>
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

<style scoped>
    .quiz-done-line {
        position: absolute;
        top: 0;
        left: 0;
        width: v-bind(quizDonePercent);
        height: 20px;
        background-color: skyblue;
        transition: cubic-bezier(0.075, 0.82, 0.165, 1) .5s;
    }

    .quiz {
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
        margin-top: 1rem;
        align-self: center;
    }

    .report-area {
        display: flex;
        flex-direction: column;
    }

    .report-area-result {
        font-size: 36px;
        font-weight: 600;
        margin-bottom: 20px;
    }

    .report-area-estim {
        font-size: 86px;
        font-weight: 700;
        margin-bottom: 20px;
    }
</style>
