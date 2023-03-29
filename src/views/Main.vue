<script setup lang="ts">
    import { ref } from "vue"
    import { useRouter } from 'vue-router'
    import { useStore } from '../store/index'
    import { userAPI } from "../http/user.api"

    import ProfileMini from "../components/Profile/ProfileMini.vue"

    import { MODES } from '../config/index'

    const selectedMode = ref('')
    const loadToDbFlag = ref(false)
    const file = ref([])
    const fileToDb = ref([])
    const store = useStore()
    const router = useRouter()

    const upload = (file: Event) => {
        store.loadTestsFromFile(file)
        router.push({ path: '/choose' })
    }

    const uploadToDb = (fileToDb: Event) => {
        store.loadTestsFromFile(fileToDb, { loadInDb: true })
    }

    const loadFromDb = () => {
        store.loadTests()
    }

    const setMode = (mode: string) => {
        selectedMode.value = mode
        store.chooseMode(selectedMode.value)
    }
</script>

<template>
    <div class="profile-mini-container">
        <ProfileMini
            :initials="userAPI.storageUserData.initials"
            :login="userAPI.storageUserData.login"
            :full-user-name="userAPI.storageUserData.username"
        />
    </div>
    <section v-if="selectedMode === ''" class="main-section">
        <h2>Выберите режим:</h2>
        <v-btn class="main-btn" @click="setMode(MODES.quiz)">Тест</v-btn>
        <v-btn class="main-btn" @click="setMode(MODES.trainer)">Тренажёр</v-btn>
    </section>
    <section v-if="selectedMode !== ''" class="input-section">
        <h3>Загрузите {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из файла или пройдите {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из базы:</h3>
        <v-file-input
            class="sto"
            clearable
            accept=".xls, .xlsx"
            v-model="file"
            label="Перетащите .xls или .xlsx таблицу в это поле, либо загрузите файл нажав на скрепку"
            @change="upload"
        ></v-file-input>
        <v-btn @click="loadFromDb()">Загрузить {{ selectedMode === 'trainer' ? 'тренажёр' : 'тест' }} из базы</v-btn>
        <v-btn @click="loadToDbFlag = true">Загрузить {{ selectedMode === 'trainer' ? 'тренажёр': 'тест' }} в базу</v-btn>
        <h4 v-show="loadToDbFlag">Выберите файл для загрузки в базу:</h4>
        <v-file-input
            v-show="loadToDbFlag"
            class="sto"
            clearable
            accept=".xls, .xlsx"
            v-model="fileToDb"
            label="Перетащите .xls или .xlsx таблицу в это поле, либо загрузите файл нажав на скрепку"
            @change="uploadToDb"
        ></v-file-input>
    </section>
</template>

<style scoped>
    h2 {
        margin-bottom: 5px;
        font-size: 36px;
    }

    .profile-mini-container {
        position: absolute;
        top: 30px;
        right: 60px;
    }

    .sto {
        width: 650px;
    }

    .main-section {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .input-section {
        display: flex;
        flex-direction: column;
    }

    /* .main-btn {
        font-size: 22px;
    } */
</style>
