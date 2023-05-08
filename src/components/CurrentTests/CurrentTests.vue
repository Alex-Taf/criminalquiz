<script setup lang="ts">
    const props = defineProps<{
        pipeline: any
    }>()
</script>

<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-badge
                v-if="props.pipeline"
                :content="props.pipeline.length"
                color="error"
            >
                <v-btn
                    icon="mdi-test-tube"
                    variant="plain"
                    size="x-large"
                    v-bind="props"
                >
                </v-btn>
            </v-badge>
            <div v-else class="icon">
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
        </v-card>
    </v-menu>
</template>

<style scoped>
.icon {
    position: relative;
    top: -10px;
}
</style>
