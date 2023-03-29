import { createWebHashHistory, createRouter } from "vue-router";

import Main from "../views/Main.vue";
import ChooseSheet from "../views/ChooseSheet.vue";
import ChooseDb from "../views/ChooseDb.vue";
import Quiz from "../views/Quiz.vue";
import Trainer from "../views/Trainer.vue";
import Login from "../views/Login.vue";
import Registration from "../views/Registration.vue";
import EstimationsHistory from "../views/EstimationsHistory.vue";

const routes = [
    {
        path: "/",
        name: "Main",
        meta: { auth: true },
        component: Main,
    },
    {
        path: "/choose",
        name: "ChooseSheet",
        meta: { auth: true },
        component: ChooseSheet,
    },
    {
        path: '/choosedb',
        name: "ChooseSheetDb",
        meta: { auth: true },
        component: ChooseDb
    },
    {
        path: "/quiz",
        name: "Quiz",
        meta: { auth: true },
        component: Quiz
    },
    {
        path: '/trainer',
        name: "Trainer",
        meta: { auth: true },
        component: Trainer
    },
    {
        path: '/history',
        name: 'EstimationsHistory',
        meta: { auth: true },
        component: EstimationsHistory
    },
    {
        path: '/login',
        name: 'Login',
        meta: { guest: true },
        component: Login
    },
    {
        path: '/registration',
        name: 'Registration',
        meta: { guest: true },
        component: Registration
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const requireAuth = to.matched.some(record => record.meta.auth)
    const guestRoute = to.matched.some(record => record.meta.guest)

    const isAuth = localStorage.getItem('token') || null

    if (!isAuth && requireAuth) {
        next('/login')
    } else if (isAuth && guestRoute) {
        next('/')
    } else {
        next()
    }
})

export default router;
