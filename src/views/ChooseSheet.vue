<script setup lang="ts">
    import { storeToRefs } from 'pinia'
import { onMounted } from 'vue';
    import { useRouter } from 'vue-router'
    import { useStore } from '../store/index'

    const store = useStore()
    const router = useRouter()

    const { sheetsTotal, mode } = storeToRefs(store)

    function selectSheet(num: number) {
        store.chooseSheet(num)
        
        if (mode.value === 'quiz') router.push({ path: '/quiz' })
        if (mode.value === 'trainer') router.push({ path: '/trainer' })
    }
</script>

<template>
    <section class="container">
        <section class="sheets">
            <template v-for="sheet in sheetsTotal">
                <va-card color="primary" gradient>
                    <va-card-title>Лист №{{ sheet }}</va-card-title>
                    <va-button @click="selectSheet(sheet - 1)">Начать исследование</va-button>
                </va-card>
            </template>
        </section>
    </section>
</template>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .sheets {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        width: 400px;
    }
</style>
