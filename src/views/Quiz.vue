<script setup lang="ts">
    import { ref, watchEffect } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useStore } from '../store/index'

    const store = useStore()

    const { sheetActive } = storeToRefs(store)

    const activeNum = ref(1)
    const questions = ref(sheetActive.value)

    const report = ref('')

    const changeActiveQuestion = (num: number) => {
        activeNum.value = num
    }

    function saveFileAs() {
        // It works on all HTML5 Ready browsers as it uses the download attribute of the <a> element:
        const element = document.createElement('a');
        
        //A blob is a data type that can store binary data
        // "type" is a MIME type
        // It can have a different value, based on a file you want to save
        const blob = new Blob([report.value], { type: 'plain/text' });

        //createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
        const fileUrl = URL.createObjectURL(blob);
        
        //setAttribute() Sets the value of an attribute on the specified element.
        element.setAttribute('href', fileUrl); //file location
        element.setAttribute('download', 'report.txt'); // file name
        element.style.display = 'none';
        
        //use appendChild() method to move an element from one element to another
        document.body.appendChild(element);
        element.click();
        
        //The removeChild() method of the Node interface removes a child node from the DOM and returns the removed node
        document.body.removeChild(element);
    }

    watchEffect(() => {
        console.log(activeNum.value)
    })
</script>

<template>
    <section class="col">
        <h1>{{ questions.find(question => question.num === activeNum).question }}</h1>
        <template v-if="activeNum !== questions.find(question => question.variants[0] === -1).num">
            <div v-for="variant in questions.find(question => question.num === activeNum).variants" class="answers row justify-center">
                <va-button class="btn" @click="changeActiveQuestion(variant)">{{ variant }} - {{ questions.find(question => question.num === variant).question }}</va-button>
            </div>
        </template>
        <template v-else>
            <section class="report-area">
                <va-input
                    class="mb-4"
                    v-model="report"
                    type="textarea"
                    placeholder="Впишите данные в отчёт"
                />
                <va-button @click="saveFileAs">Сохранить отчёт</va-button>
            </section>
        </template>
    </section>
</template>

<style scoped>
    h1 {
        margin-bottom: 3rem;
    }

    .answers {
        max-width: 600px;
    }

    .btn {
        width: 100%;
        margin-bottom: 1rem;
    }

    .report-area {
        display: flex;
        flex-direction: column;
    }
</style>
