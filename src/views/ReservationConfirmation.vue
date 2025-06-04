<template>
  <div class="confirmation-container">
    <h1>Thank you for your reservation</h1>
    <p>
      You reserved
      <strong>{{ article.title }}</strong>
      from {{ formattedStart }} to {{ formattedEnd }}.
    </p>
    <button @click="goHome" class="return-button">Return Home</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import articles from '../data/articles.js'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const id    = parseInt(route.query.id, 10)
const start = route.query.start
const end   = route.query.end

const article = computed(() =>
  articles.find(a => a.id === id) || { title: 'Unknown' }
)
const formattedStart = computed(() =>
  start ? new Date(start).toISOString().slice(0,10) : '?'
)
const formattedEnd = computed(() =>
  end ? new Date(end).toISOString().slice(0,10) : '?'
)

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.confirmation-container {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: #f7f7f7;
  border-radius: 8px;
  text-align: center;
}
.return-button {
  margin-top: 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
}
.return-button:hover {
  background: #36976d;
}
</style>
