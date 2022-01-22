<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import { search, getKLineM5, getKLineD1 } from './api/stock/stock-api';

search('000301').then(res => console.log(`search : `, res));
getKLineM5('0.000301').then(res => console.log(`kline m5 : `, res));
getKLineD1('0.000301', 2).then(res => console.log(`kline d1 : `, res));
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
