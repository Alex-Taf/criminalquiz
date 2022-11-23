<script setup lang="ts">
    import { ref } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useStore } from '../store/index'

    const store = useStore()

    const { sheetActive } = storeToRefs(store)

    const activeNum = ref(1)
    const report = ref('')

    const changeActiveQuestion = (num: number) => {
        activeNum.value = num
    }

    const findQuestionLabel = () => {
        return sheetActive.value.find((q) => q.num === 1).question
    }

    const getActiveVariants = () => {
        console.log(sheetActive.value.find(question => question.num === activeNum.value))
        return sheetActive.value.find(question => question.num === activeNum.value).variants
    }

    const isFinalQuestion = () => {
        return activeNum !== sheetActive.value.find(question => question.variants[0] === -1 || question.variants.length === 0).num
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
</script>

<template>
    <section class="quiz col">
        <h1>{{ findQuestionLabel() }}</h1>
        <template v-if="isFinalQuestion()">
            <div class="answers">
                <section>
                    <template v-for="variant in getActiveVariants()" :key="variant">
                        <va-button class="btn" @click="changeActiveQuestion(variant)">
                            {{ sheetActive.find(question => question.num === variant).question }}
                        </va-button>
                    </template>
                </section>
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
    .quiz {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    h1 {
        margin-bottom: 3rem;
        width: 500px;
    }

    .answers {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .answers section {
        width: 600px;
    }

    .btn {
        display: flex;
        width: 100%;
        margin-bottom: 1rem;
        align-self: center;
    }

    .report-area {
        display: flex;
        flex-direction: column;
    }
</style>
