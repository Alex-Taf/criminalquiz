<script setup lang="ts">
    import { ref } from "vue"
    import { useRouter } from 'vue-router'
    import { useStore } from '../store/index'

    import { MODES } from '../config/index'

    const selectedMode = ref('')
    const file = ref([])
    const store = useStore()
    const router = useRouter()

    const upload = (e: Event) => {
        store.handleFileAsync(e)
        router.push({ path: '/choose' })
    }

    const setMode = (mode: string) => {
        selectedMode.value = mode
        store.chooseMode(selectedMode.value)
    } 
</script>

<template>
    <h2 v-if="selectedMode === ''">Выберите режим:</h2>
    <section v-if="selectedMode === ''" class="main-section">
        <va-button class="main-btn" @click="setMode(MODES.quiz)">Тест</va-button>
        <va-button class="main-btn" @click="setMode(MODES.trainer)">Тренажёр</va-button>
    </section>
    <va-file-upload
        v-if="selectedMode !== ''"
        id="load-file"
        v-model="file"
        file-types="xls,xlsx"
        drop-zone-text="Перетащите .xls или .xlsx таблицу в это поле, либо"
        upload-button-text="Загрузите нажав на кнопку..."
        dropzone
        @file-added="upload"
    />
</template>

<style scoped>
    h2 {
        margin-bottom: 5px;
        font-size: 36px;
    }

    .main-section {
        display: flex;
        gap: 2px;
    }

    .main-btn {
        font-size: 32px;
    }
</style>
