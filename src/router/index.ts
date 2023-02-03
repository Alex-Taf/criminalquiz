import { createWebHashHistory, createRouter } from "vue-router";

import Main from "../views/Main.vue";
import ChooseSheet from "../views/ChooseSheet.vue";
import Quiz from "../views/Quiz.vue";
import Trainer from "../views/Trainer.vue";

const routes = [
    {
        path: "/",
        name: "Main",
        component: Main,
    },
    {
        path: "/choose",
        name: "ChooseSheet",
        component: ChooseSheet,
    },
    {
        path: "/quiz",
        name: "Quiz",
        component: Quiz
    },
    {
        path: '/trainer',
        name: "Trainer",
        component: Trainer
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
