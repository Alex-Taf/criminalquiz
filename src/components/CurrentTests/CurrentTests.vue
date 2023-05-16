<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useStore } from '../../store/index'
    import { storeToRefs } from "pinia"

    const store = useStore()

    const props = defineProps<{
        pipeline: any
    }>()

    const loadTest = (id: number) => {
        store.loadTestFromPipeline(id)
    }

    const pipes = ref([])

    watch(props, () => {
        pipes.value = props.pipeline
    })
</script>

<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn
                v-if="pipes.length > 0"
                class="tw-relative -tw-top-1"
                variant="plain"
                size="x-large"
                v-bind="props"
            >
                <v-badge
                    :content="pipes.length"
                    color="error"
                >
                    <v-icon>mdi-test-tube</v-icon>
                </v-badge>
            </v-btn>
            <div v-else class="tw-relative -tw-top-1">
                <v-btn
                    icon="mdi-test-tube"
                    variant="plain"
                    v-bind="props"
                >
                </v-btn>
            </div>
        </template>
        <v-card min-height="100px">
            <v-card-text v-if="!props.pipeline">
                <div class="mx-auto text-center">
                    <h3>Нет текущих тестов</h3>
                </div>
            </v-card-text>
            <v-card-text v-else class="tw-min-w-[400px]">
                <div class="tw-py-3 tw-px-1">
                    <div v-for="pipe in props.pipeline" class="tw-flex tw-justify-between tw-px-2 tw-py-2">
                        <div class="tw-flex tw-gap-x-5">
                            <p class="tw-flex tw-text-gray-700">
                                <svg
                                    class="tw-w-4 tw-mx-2"
                                    :class="{ 'tw-text-teal-500': pipe.mode === 'quiz', 'tw-text-gray-500': pipe.mode === 'trainer' }"
                                    viewBox="0 0 8 8"
                                    fill="currentColor"
                                >
                                    <circle cx="4" cy="4" r="3" />
                                </svg>
                                <span class="tw-text-base">{{ pipe.testname }}</span>
                            </p>
                            <p v-if="pipe.mode === 'quiz'" class="tw-text-gray-500 tw-font-thin tw-text-base">Тест</p>
                            <p v-if="pipe.mode === 'trainer'" class="tw-text-gray-500 tw-font-thin tw-text-base">Тренажёр</p>
                        </div>
                        <v-btn color="green" size="x-small" @click="loadTest(pipe.testId)">Продолжить</v-btn>
                    </div>
                </div>
            </v-card-text>
        </v-card>
    </v-menu>
</template>
