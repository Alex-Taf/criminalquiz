<script setup lang="ts">
    import { onMounted, ref, watch, watchEffect } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useStore } from '../store';
    import { useRouter } from 'vue-router';
    import type { Header, ServerOptions } from "vue3-easy-data-table"
    import { calculatePages } from "../utils"
    import { notify } from "@kyvg/vue3-notification";

    const router = useRouter()

    const store = useStore()
    const { tests, total } = storeToRefs(store)

    const loading = ref(true)

    const search = ref('')
    const headers: Header[] = [
      { text: "Название теста", value: "testname" },
      { text: "", value: "operation"}
    ];

    const totalLength = ref(0)
    const pages = ref(0)

    const serverOptions = ref<ServerOptions>({
        page: 1,
        rowsPerPage: 5
    });

    const setPagination = () => {
        totalLength.value = total.value
        pages.value = Math.ceil(calculatePages(totalLength.value, serverOptions.value.rowsPerPage))
      }

    const fetchData = async () => {
      await store.loadAllTests({
        page: serverOptions.value.page,
        rowsPerPage: serverOptions.value.rowsPerPage
      },
      {
        field: 'testname',
        value: search.value
      })
    }

    const removeTest = (id: number) => {
      loading.value = true

      // Async update when item delete
      store.purgeTest(id).then(() => {
        notify({
          type: 'success',
          title: 'Запись удалена!'
        })
        
        fetchData().then(() => loading.value = false)
      })
    }

    onMounted(() => {
      fetchData().then(() => loading.value = false)
      if (total.value !== 0) {
        setPagination()
      }
    })

    watch(
      serverOptions,
      () => {
        loading.value = true
        fetchData().then(() => loading.value = false)
      },
      { deep: true }
    )

    watchEffect(() => {
      console.log(tests.value)
      if (total.value !== 0) {
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
        :items="tests"
        v-model:server-options="serverOptions"
        :server-items-length="total"
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

        <template #item-testname="{ row }">
          <span style="font-size: 16px">{{ row.testname }}</span>
        </template>

        <template #item-operation="{ row }">
            <div class="operation-wrapper">
                <v-icon
                    icon="mdi-delete-off"
                    @click="removeTest(row.id)"
                ></v-icon>
            </div>
        </template>
      </EasyDataTable>
      <v-pagination
        v-model="serverOptions.page"
        :length="pages"
        :total-visible="5"
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
