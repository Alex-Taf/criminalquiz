<script setup lang="ts">
import { reactive, ref } from "vue";
import { userAPI } from "../http/user.api";
import { notify } from "@kyvg/vue3-notification";
import { useRouter } from "vue-router";

const showPass = ref(false);
const registered = ref(false);
const registeredMessage = ref('');

const router = useRouter()

const state = reactive({
  login: "",
  username: "",
  password: "",
  passwordConfirm: "",
});

const rules = reactive({
  login: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
    min: (v) => v.length >= 4 || "Минимальная длина логина - 4 символа.",
  },
  username: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
  },
  password: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
    min: (v) => v.length >= 8 || "Минимальная длина пароля - 8 символов.",
  },
  passwordConfirm: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
    matched: (value) => state.password === value || "Парли не совпадают",
  },
});

const signUp = async () => {
  try {
    const response = await userAPI.registration(state.login, state.username, state.password);
    
    registered.value = response.isSignUp
    registeredMessage.value = response.message
    // user.setAuth(true);
    // user.login(response);
    // router.push({ name: "Dashboard" });
  } catch (e) {
    if (e.response) {
      notify({
        type: 'error',
        title: 'Ошибка',
        text: e?.response?.data?.message
      });
    }
  }
};
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-sheet v-if="!registered" width="400" class="mx-auto">
      <v-form fast-fail @submit.prevent="signUp">
        <v-text-field
          v-model="state.login"
          :rules="[rules.login.required, rules.login.min]"
          label="Логин"
        ></v-text-field>
        <v-text-field
          v-model="state.username"
          :rules="[rules.username.required]"
          label="Никнейм"
        ></v-text-field>
        <v-text-field
          v-model="state.password"
          label="Пароль"
          :rules="[rules.password.required, rules.password.min]"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
        ></v-text-field>
        <v-text-field
          v-model="state.passwordConfirm"
          :rules="[rules.passwordConfirm.required]"
          type="password"
          label="Потдвердите пароль"
        ></v-text-field>
        <!-- <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a> -->
        <v-btn type="submit" color="primary" block class="mt-2"
          >Зарегистрироваться</v-btn
        >
      </v-form>
      <div class="mt-2">
        <p class="text-body-2">
          Уже есть аккаунт? <router-link to="/login">Войдите</router-link>
        </p>
      </div>
    </v-sheet>
    <v-sheet
      v-else
      elevation="12"
      max-width="600"
      rounded="lg"
      width="100%"
      class="pa-4 text-center mx-auto"
    >
      <v-icon
        class="mb-5"
        color="success"
        icon="mdi-check-circle"
        size="112"
      ></v-icon>

      <h2 class="text-h5 mb-6">{{ registeredMessage }}</h2>

      <p class="mb-4 text-medium-emphasis text-body-2">
        <!-- <router-link to="/login"
          ><span class="text-decoration-none text-info">Войти в систему</span></router-link
        > -->
        <br />
      </p>

      <v-divider class="mb-4"></v-divider>

      <div class="text-end">
        <v-btn
          class="text-none"
          color="success"
          rounded
          variant="flat"
          width="90"
          @click="router.push({ path: '/login' })"
        >
          Войти
        </v-btn>
      </div>
    </v-sheet>
  </div>
</template>
