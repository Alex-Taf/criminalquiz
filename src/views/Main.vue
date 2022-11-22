<script setup lang="ts">
    import { ref } from "vue"
    import { useRouter } from 'vue-router'
    import { useStore } from '../store/index'

    const file = ref([])
    const store = useStore()
    const router = useRouter()

    const upload = (e: Event) => {
        store.handleFileAsync(e)
        router.push({ path: '/choose' })
    }
</script>

<template>
    <va-file-upload
        id="load-file"
        v-model="file"
        file-types="xls,xlsx"
        drop-zone-text="Перетащите .xls или .xlsx таблицу в это поле, либо"
        upload-button-text="Загрузите нажав на кнопку..."
        dropzone
        @file-added="upload"
    />
</template>
