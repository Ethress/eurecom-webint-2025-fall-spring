<template>
  <div v-if="article">
    <h1>{{ article.title }}</h1>
    <p>{{ article.body }}</p>
  </div>
  <div v-else>
    <p>Article not found.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import articles from '../data/articles.js'

// grab the :id param
const route = useRoute()

// find the matching article (string → number)
const article = computed(() =>
  articles.find(a => a.id === Number(route.params.id))
)

</script>

