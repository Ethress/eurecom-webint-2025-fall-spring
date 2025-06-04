<template>
  <div v-if="article">
    <div class="article-container">
      <h1>{{ article.title }}</h1>
      <p><strong>Address:</strong> {{ article.address }}</p>
      <p><strong>Price:</strong> {{ article.price }} €/h</p>
      <p><strong>Grade:</strong> {{ article.grade }} ★</p>
      <p><strong>Description:</strong> {{ article.body }}</p>
    
      <div class="carousel">
        <img :src="article.image[currentImageIndex]" class="carousel-img" />
        <button class="carousel-btn left" @click="prevImage">&#10094;</button>
        <button class="carousel-btn right" @click="nextImage">&#10095;</button>
      </div>

      <div id="map" class="map-container"></div>

      <div class="reservation-wrapper">
        <button class="reservation-button" @click="handleReserve">Reserve this Spot</button>
      </div>
    </div>
  </div>

  <div v-else>
    <p style="color: red">❌ Article not found for ID {{ route.params.id }}</p>
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

import { ref } from 'vue'

const currentImageIndex = ref(0)

function nextImage() {
  if (article.value.image && article.value.image.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % article.value.image.length
  }
}

function prevImage() {
  if (article.value.image && article.value.image.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + article.value.image.length) % article.value.image.length
  }
}

import L from 'leaflet'
import { onMounted } from 'vue'

onMounted(() => {
  const map = L.map('map').setView([article.value.lat, article.value.lng], 16)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map)

  L.marker([article.value.lat, article.value.lng]).addTo(map)
})
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

.carousel {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 350px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 50%;
  z-index: 2;
}

.carousel-btn.left {
  left: 10px;
}

.carousel-btn.right {
  right: 10px;
}

.map-container {
  height: 300px;
  width: 100%;
  max-width: 600px;
  margin: 2rem auto;
  border-radius: 10px;
}

</style>
