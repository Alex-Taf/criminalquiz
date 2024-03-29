<script setup lang="ts">
    import { onMounted, ref, watch, watchEffect } from 'vue';
    import { storeToRefs } from 'pinia';
    import { userAPI } from '../http/user.api';
    import { useStore } from '../store';
    import { useRouter } from 'vue-router';
    import type { Header, ServerOptions } from "vue3-easy-data-table"
    import { calculatePages, getEstimationColor } from "../utils"

    const router = useRouter()

    const store = useStore()
    const { userEstimationsData, estTotal } = storeToRefs(store)

    const loading = ref(true)

    const search = ref('')
    const headers: Header[] = [
      { text: "Название теста", value: "testname" },
      { text: "Оценка за тест", value: "estimation", sortable: true },
    ];

    const totalLength = ref(0)
    const pages = ref(0)

    const serverOptions = ref<ServerOptions>({
        page: 1,
        rowsPerPage: 5
    });

    const setPagination = () => {
        totalLength.value = estTotal.value
        pages.value = calculatePages(totalLength.value, serverOptions.value.rowsPerPage)
    }

    const fetchData = async () => {
      await store.loadUserEstimations(
      +userAPI.storageUserData.id,
      {
        page: serverOptions.value.page,
        rowsPerPage: serverOptions.value.rowsPerPage
      },
      {
        field: 'testname',
        value: search.value
      })
    }

    onMounted(() => {
      fetchData().finally(() => loading.value = false)
    })

    watch(
      serverOptions,
      () => {
        loading.value = true
        fetchData().finally(() => loading.value = false)
      },
      { deep: true }
    )

    watchEffect(() => {
      if (estTotal.value !== 0) {
        setPagination()
      }
    })
</script>

<template>
  <section class="flex flex-col v-table">
    <v-card class="mb-5">
      <v-card-text>
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
      <EasyDataTable
        :loading="loading"
        :headers="headers"
        :items="userEstimationsData"
        v-model:server-options="serverOptions"
        :server-items-length="estTotal"
        :hide-footer="true"
      >
        <template #loading>
          <v-progress-circular
            indeterminate
            color="blue"
          ></v-progress-circular>
        </template>

        <template #header-testname="header">
          <span style="font-size: 18px">{{ header.text }}</span>
        </template>

        <template #header-estimation="header">
          <span style="font-size: 18px">{{ header.text }}</span>
        </template>

        <template #item-testname="{ testname }">
          <span style="font-size: 16px">{{ testname }}</span>
        </template>

        <template #item-estimation="{ estimation }">
          <span :style="{ fontSize: '16px', color: getEstimationColor(estimation) }">
            {{ estimation }}
          </span>
        </template>
      </EasyDataTable>
      <v-pagination
        v-model="serverOptions.page"
        :length="pages"
        :total-visible="6"
      ></v-pagination>
      </v-card>
    <v-btn color="blue" @click="router.push({ path: '/' })">Вернуться на главную</v-btn>
  </section>
</template>

<style>
  .v-table {
    width: 600px !important;
  }

  .v-table__search {
    width: 600px !important;
  }
</style>
