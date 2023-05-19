<script setup lang="ts">
    import { onMounted, ref } from "vue"
    import { useRouter } from 'vue-router'
    import { useStore } from '../store/index'
    import { storeToRefs } from "pinia"
    import { userAPI } from "../http/user.api"

    import ProfileMini from "../components/Profile/ProfileMini.vue"
    import CurrentTests from "../components/CurrentTests/CurrentTests.vue"

    import { MODES } from '../config/index'

    const selectedMode = ref('')
    const loadToDbFlag = ref(false)
    const file = ref([])
    const fileToDb = ref([])
    const store = useStore()
    const router = useRouter()

    const { testsPipeline } = storeToRefs(store)

    const upload = (file: Event) => {
        store.loadTestsFromFile(file)
        router.push({ path: '/choose' })
    }

    const uploadToDb = (fileToDb: Event) => {
        store.loadTestsFromFile(fileToDb, { loadInDb: true })
    }

    const loadFromDb = () => {
        router.push({ path: '/choosedb' })
    }

    const setMode = (mode: string) => {
        selectedMode.value = mode
        store.chooseMode(selectedMode.value)
    }

    const reset = () => {
        selectedMode.value = ""
        loadToDbFlag.value = false
        store.chooseMode('')
    }

    onMounted(() => {
        store.loadTestsPipeline()
    })
</script>

<template>
    <div class="tw-absolute tw-flex tw-gap-[50px] tw-top-[30px] tw-right-[60px]">
        <CurrentTests :pipeline="testsPipeline" />
        <ProfileMini
            :initials="userAPI.storageUserData.initials"
            :login="userAPI.storageUserData.login"
            :full-user-name="userAPI.storageUserData.username"
        />
    </div>
    <section v-if="selectedMode === ''" class="tw-flex tw-flex-col tw-gap-x-2">
        <h2>Выберите режим:</h2>
        <v-btn color="blue" class="tw-mb-[10px]" @click="setMode(MODES.quiz)">Тест</v-btn>
        <v-btn color="green" class="tw-mb-[10px]" @click="setMode(MODES.trainer)">Тренажёр</v-btn>
    </section>
    <section v-if="selectedMode !== ''" class="tw-flex tw-flex-col tw-gap-x-2">
        <h3 v-show="!loadToDbFlag" class="tw-mb-2">Загрузите {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из файла или пройдите {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из базы:</h3>
        <v-file-input
            v-show="!loadToDbFlag"
            class="tw-w-[650px]"
            clearable
            accept=".xls, .xlsx"
            v-model="file"
            label="Перетащите .xls или .xlsx таблицу в это поле, либо загрузите файл нажав на скрепку"
            @change="upload"
        ></v-file-input>
        <h4 v-show="loadToDbFlag">Выберите файл для загрузки в базу:</h4>
        <v-file-input
            v-show="loadToDbFlag"
            class="tw-w-[650px]"
            clearable
            accept=".xls, .xlsx"
            v-model="fileToDb"
            label="Перетащите .xls или .xlsx таблицу в это поле, либо загрузите файл нажав на скрепку"
            @change="uploadToDb"
        ></v-file-input>
        <v-btn color="blue" class="mb-4" v-show="!loadToDbFlag" @click="loadFromDb()">Загрузить {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из базы</v-btn>
        <v-btn color="green" class="mb-4" v-show="!loadToDbFlag" @click="loadToDbFlag = true">Загрузить {{ selectedMode === 'trainer' ? 'тренажёр': 'тест' }} в базу</v-btn>
        <v-btn color="orange" @click="reset()">Отмена</v-btn>
    </section>
</template>

<style scoped>
    h2 {
        margin-bottom: 5px;
        font-size: 36px;
    }
</style>
