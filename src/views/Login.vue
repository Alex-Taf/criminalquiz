<script setup lang="ts">
import { reactive, ref } from "vue";
import { userAPI } from "../http/user.api";
import { notify } from "@kyvg/vue3-notification";
import { ISignInResponse } from "../interfaces"
import { useRouter } from "vue-router";

const router = useRouter()

const showPass = ref(false);

const rules = reactive({
  login: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
  },
  password: {
    required: (value) => !!value || "Поле обязательно для заполнения.",
    min: (v) => v.length >= 8 || "Минимальная длина пароля - 8 символов.",
  },
});

const state = reactive({
  login: "",
  password: "",
});

const signIn = async () => {
  try {
    const response: ISignInResponse = await userAPI.login(
      state.login,
      state.password
    )

    userAPI.saveToStorage()

    notify({
      type: 'success',
      title: 'Выполнено',
      text: response.data.message
    })

    router.push({ path: '/' })
  } catch (e) {
    notify({
      type: 'error',
      title: 'Ошибка',
      text: e?.response?.data?.message
    });
  }
};
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-sheet width="400" class="mx-auto">
      <v-form fast-fail @submit.prevent="signIn">
        <v-text-field
          v-model="state.login"
          label="Логин"
          :rules="[rules.login.required]"
        ></v-text-field>
        <v-text-field
          v-model="state.password"
          label="Пароль"
          :rules="[rules.password.required, rules.password.min]"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPass ? 'text' : 'password'"
          @click:append="showPass = !showPass"
        ></v-text-field>
        <!-- <a href="#" class="text-body-2 font-weight-regular">Forgot Password?</a> -->
        <v-btn type="submit" color="primary" block class="mt-2">Войти</v-btn>
      </v-form>
      <div class="mt-2">
        <p class="text-body-2">
          Нет аккаунта?
          <router-link to="/registration">Зарегистрируйтесь.</router-link>
        </p>
      </div>
    </v-sheet>
  </div>
</template>
