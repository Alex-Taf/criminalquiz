<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, watchEffect } from "vue";
import { useStore } from "../store/index";
import type { ServerOptions } from "vue3-easy-data-table";
import { calculatePages } from "../utils";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStore();

const { testsNames, mode, total } = storeToRefs(store);

const loading = ref(true);

const search = ref("");

const totalLength = ref(0);
const pages = ref(0);

const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 5,
});

const setPagination = () => {
  totalLength.value = total.value;
  pages.value = Math.ceil(calculatePages(
    totalLength.value,
    serverOptions.value.rowsPerPage
  ));
};

const fetchData = async () => {
  await store.loadTestsByAppMode(
    {
      page: serverOptions.value.page,
      rowsPerPage: serverOptions.value.rowsPerPage,
    },
    {
      field: "testname",
      value: search.value,
    }
  );
};

function chooseTest(num: number) {
  store.chooseTest(num);
}

watch(
  serverOptions,
  () => {
    loading.value = true;
    fetchData().finally(() => (loading.value = false));
  },
  { deep: true }
);

onMounted(() => {
  fetchData().finally(() => (loading.value = false));
});

watchEffect(() => {
  if (total.value !== 0) {
    setPagination();
  }
});
</script>

<template>
  <section class="container">
    <h2 class="mb-10">
      Выберите {{ mode === "quiz" ? "тест" : "тренажёр" }} из списка
    </h2>
    <v-card-text class="search">
        <v-text-field
          v-model.trim="search"
          density="compact"
          variant="solo"
          label="Искать"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          @input="fetchData"
        ></v-text-field>
    </v-card-text>
    <section class="sheets">
      <template v-for="test in testsNames">
        <v-card class="mx-auto" max-width="344" variant="outlined">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">
                {{ mode === "quiz" ? "Тест" : "Тренажёр" }} №{{ test.idx }}
              </div>
              <div class="text-caption">{{ test.testname }}</div>
            </div>
          </v-card-item>

          <v-card-actions>
            <v-btn
              color="teal-accent-4"
              variant="outlined"
              @click="chooseTest(test.idx)"
            >
              Выбрать {{ mode === "quiz" ? "тест" : "тренажёр" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <v-pagination
        v-show="totalLength > 0"
        v-model="serverOptions.page"
        :length="pages"
        :total-visible="6"
      ></v-pagination>
      <v-btn color="blue" @click="router.push({ path: '/' })">Вернуться на главную</v-btn>
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

.search {
  width: 400px;
}

.sheets {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  width: 400px;
}
</style>
