<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useStore } from "../store/index";

const store = useStore();

const { testsNames, mode } = storeToRefs(store);

function chooseTest(num: number) {
  store.chooseTest(num);
}

onMounted(() => {
    store.loadTests()
})
</script>

<template>
  <section class="container">
    <h2 class="mb-10">Выберите {{ mode === "quiz" ? "тест" : "тренажёр" }} из списка</h2>
    <section class="sheets">
      <template v-for="(test, index) in testsNames">
        <v-card class="mx-auto" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">{{ mode === "quiz" ? "Тест" : "Тренажёр" }} №{{ index + 1 }}</div>
              <div class="text-caption">{{ test }}</div>
            </div>
          </v-card-item>

          <v-card-actions>
            <v-btn color="teal-accent-4" variant="outlined" @click="chooseTest(index + 1)">
              Выбрать {{ mode === "quiz" ? "тест" : "тренажёр" }}
            </v-btn>
          </v-card-actions>
        </v-card>
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
