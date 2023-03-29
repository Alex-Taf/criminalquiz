<script setup lang="ts">
  import router from "../../router"
  import { userAPI } from "../../http/user.api";

  const props = defineProps<{
    initials: string | null,
    fullUserName: string | null,
    login: string | null
  }>()

  const logout = () => {
    userAPI.purgeToken()
    userAPI.purgeFromStorage()
    router.push({ path: "/login" })
  }
</script>

<template>
    <v-row justify="center">
      <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar
              color="brown"
              size="large"
            >
              <span class="text-h5">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
                size="large"
              >
                <span class="text-h5">{{ props.initials }}</span>
              </v-avatar>
              <h3>{{ props.fullUserName }}</h3>
              <p class="text-caption mt-1">
                {{ props.login }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                rounded
                variant="text"
              >
                История оценок
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                rounded
                variant="text"
                @click="logout"
              >
                Выйти
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
</template>
