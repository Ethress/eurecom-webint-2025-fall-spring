<template>
  <div class="article-container" v-if="article">
    <h1>{{ article.title }}</h1>
    <p><strong>Address:</strong> {{ article.address }}</p>
    <p><strong>Price:</strong> {{ article.price }} €/h</p>
    <p><strong>Grade:</strong> {{ article.grade }} ★</p>
    <p><strong>Description:</strong> {{ article.body }}</p>

    <div class="images">
      <img v-for="(img, index) in article.image" :key="index" :src="img" :alt="article.title" />
    </div>
  </div>

  <div v-else>
    <p style="color: red">❌ Article not found for ID {{ route.params.id }}</p>
  </div>

  <div class="reservation-wrapper">
    <button class="reservation-button">Reserve this Spot</button>
  </div>


</template>

<script setup>
import { useRoute } from 'vue-router'
import articles from '../data/articles.js'
import { computed } from 'vue'

const route = useRoute()

const articleId = computed(() => parseInt(route.params.id))
const article = computed(() =>
  articles.find(a => a.id === articleId.value)
)

function handleReserve() {
  alert(`Reservation of parking : ${article.value.title}`)
}
</script>

<style scoped>
.article-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background:rgb(174, 174, 174);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.images {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 1rem;
}
.images img {
  width: 200px;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.reservation-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.reservation-button {
  background-color: #42b983;
  color: white;
  font-size: 1.2rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reservation-button:hover {
  background-color: #36976d;
}
</style>
