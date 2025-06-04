<template>
  <div v-if="article">
    <div class="article-container">
      <h1>{{ article.title }}</h1>
      <p><strong>Address:</strong> {{ article.address }}</p>
      <p><strong>Price:</strong> {{ article.price }} €/h</p>
      <p><strong>Grade:</strong> {{ article.grade }} ★</p>
      <p><strong>Description:</strong> {{ article.body }}</p>

      <div class="item-tags">
        <strong>Tags:</strong>
        <span v-for="tag in article.tags" :key="tag" class="tag-pill">
          {{ tag }}
        </span>
      </div>

      <div class="carousel">
        <img :src="article.image[currentImageIndex]" class="carousel-img" />
        <button class="carousel-btn left" @click="prevImage">&#10094;</button>
        <button class="carousel-btn right" @click="nextImage">&#10095;</button>
      </div>

      <div id="map" class="map-container"></div>

      <div class="availability-calendar">
        <h2>Availability</h2>
        <DateRangePicker
          :reserved-dates="article.reservedDates"
          :initial-start="pickedRange.start"
          :initial-end="pickedRange.end"
          @confirm="onDateConfirm"
        />
      </div>

      <div class="reservation-wrapper">
        <button
          class="reservation-button"
          :disabled="!pickedRange.start || isInvalidRange"
          @click="handleReserve"
        >
          <template v-if="!pickedRange.start">Select a date</template>
          <template v-else-if="isInvalidRange">A selected day is unavailable</template>
          <template v-else>
            Reserve between {{ pickedRange.start.toDateString() }} and {{ pickedRange.end.toDateString() }}
          </template>
        </button> 
      </div>
    </div>
  </div>

  <div v-else>
    <p style="color: red">
      ❌ Article not found for ID {{ route.params.id }}
    </p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import articles from '../data/articles.js'
import { computed, ref, reactive, onMounted } from 'vue'
import DateRangePicker from './DateRangePicker.vue'
import L from 'leaflet'

const route = useRoute()
const articleId = computed(() => parseInt(route.params.id, 10))
const article = computed(() =>
  articles.find(a => a.id === articleId.value)
)

const currentImageIndex = ref(0)
function nextImage() {
  if (article.value.image.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value + 1) % article.value.image.length
  }
}
function prevImage() {
  if (article.value.image.length > 0) {
    currentImageIndex.value =
      (currentImageIndex.value - 1 + article.value.image.length) %
      article.value.image.length
  }
}

const pickedRange = reactive({ start: null, end: null })
if (route.query.start && route.query.end) {
  pickedRange.start = new Date(route.query.start)
  pickedRange.end   = new Date(route.query.end)
}
function onDateConfirm(range) {
  pickedRange.start = range.start
  pickedRange.end = range.end
}

// check if picked range overlaps any reservedDates
const isInvalidRange = computed(() => {
  if (!pickedRange.start || !pickedRange.end) return false
  const s = pickedRange.start.getTime()
  const e = pickedRange.end.getTime()
  return article.value.reservedDates.some(r => {
    const rs = new Date(r.start).getTime()
    const re = new Date(r.end).getTime()
    return rs < e && re > s 
  })
})        

function handleReserve() {
  // only called when valid
  alert(`Reservation: ${article.value.title} from ${pickedRange.start.toDateString()} to ${pickedRange.end.toDateString()}`)
}

onMounted(() => {
  if (!article.value) return
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
  background: rgb(174, 174, 174);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-pill {
  display: inline-block;
  background-color: #e0e0e0;
  color: #333;
  padding: 4px 8px;
  margin-right: 6px;
  border-radius: 12px;
  font-size: 0.9rem;
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
  background: rgba(0, 0, 0, 0.4);
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

.availability-calendar {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 2rem auto;
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
.reservation-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
.reservation-button:hover:enabled {
  background-color: #36976d;
}
</style>
