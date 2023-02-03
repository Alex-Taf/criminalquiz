<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

img {
  margin: 5px;
}

.plugins {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
}

.slide-enter-from {
  position: absolute;
  opacity: 0;
  right: -100%;
}

.slide-enter-to {
  position: absolute;
  opacity: 0.3;
  right: 0;
}

.slide-leave-from {
  position: absolute;
  opacity: 0.6;
  left: 0;
}

.slide-leave-to {
  position: absolute;
  opacity: 1;
  left: -100%;
}

.va-checkbox__label {
  width: 500px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>
