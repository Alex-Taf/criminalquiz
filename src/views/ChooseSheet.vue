<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useStore } from "../store/index";

const store = useStore();
const router = useRouter();

const { sheetsTotalCount, mode } = storeToRefs(store);

function selectSheet(num: number) {
  store.chooseSheet(num);

  if (mode.value === "quiz") router.push({ path: "/quiz" });
  if (mode.value === "trainer") router.push({ path: "/trainer" });
}
</script>

<template>
  <section class="container">
    <section class="sheets">
      <template v-for="sheet in sheetsTotalCount">
        <v-card class="mx-auto" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">Лист №{{ sheet }}</div>
              <div class="text-caption">Тестирование</div>
            </div>
          </v-card-item>

          <v-card-actions>
            <v-btn color="teal-accent-4" variant="outlined" @click="selectSheet(sheet - 1)">
              Начать исследование
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </section>
  </section>
</template>

<style scoped>
/* .container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
} */

/* .sheets {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  width: 400px;
} */
</style>
