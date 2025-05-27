<template>
  <div class="map-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-search">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search articles..."
          class="search-input"
        />
      </div>
      <div class="articles-list">
        <router-link
          v-for="article in filteredArticles"
          :key="article.id"
          :to="{ name: 'article', params: { id: article.id } }"
          class="article-item"
        >
          <img :src="article.image[0]" :alt="article.title" class="item-img" />
          <div class="item-info">
            <h3 class="item-title">{{ article.title }}</h3>
            <p class="item-price">{{ article.price }} € /h</p>
          </div>
        </router-link>
      </div>
    </aside>

    <!-- Map -->
    <div id="map" ref="mapContainer" class="map-view"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import articles from '../data/articles.js'

const mapContainer = ref(null)
const searchQuery = ref('')
const router = useRouter()
let map = null

const filteredArticles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return articles
  return articles.filter(a => a.title.toLowerCase().includes(q))
})

onMounted(() => {
  map = L.map(mapContainer.value).setView([48.8566, 2.3522], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

  // Place markers
  articles.forEach(({ id, lat, lng, price, title, image }) => {
    if (
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      typeof price !== 'number' ||
      !title ||
      !image
    ) {
      console.warn(`Skipping article ${id}: missing data`)
      return
    }

    const html = `<div class=\"price-label\">${price}&nbsp;$</div>`
    const icon = L.divIcon({
      className: 'custom-price-icon',
      html,
      iconAnchor: [15, 15],
    })

    const marker = L.marker([lat, lng], { icon }).addTo(map)
    const tooltipHtml = `
      <div class=\"hover-popup\">
        <img src=\"${image[0]}\" alt=\"${title}\" class=\"popup-img\"/>
        <h4 class=\"popup-title\">${title}</h4>
      </div>
    `
    marker.bindTooltip(tooltipHtml, {
      direction: 'top',
      offset: [0, -20],
      opacity: 0.9,
      className: 'custom-tooltip',
      sticky: true
    })
    marker.on('click', () => {
      router.push({ name: 'article', params: { id } })
    })
  })
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<style scoped>
.map-container {
  display: flex;
  height: 80vh;
}

/* Sidebar styles */
.sidebar {
  width: 30%;
  max-width: 300px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.sidebar-search {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.9);
  border-radius: 0.75rem;
}

.search-icon {
  margin-right: 0.5rem;
  font-size: 1rem;
  color: #666;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  overflow-y: auto;
}

.articles-list::-webkit-scrollbar {
  width: 8px;
}
.articles-list::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

.article-item {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  background: #f9f9f9;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  transition: transform .2s;
  padding: 1rem;
  min-height: 120px;
}
.article-item:hover {
  transform: translateY(-2px);
}

.item-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.item-info {
  flex: 1;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.item-price {
  margin: 0;
  font-size: 0.9rem;
  color: #42b983;
  font-weight: bold;
}

.map-view {
  flex: 1;
}
</style>

<!-- Global styles for Leaflet icons and tooltips -->
<style>
.custom-price-icon .price-label {
  display: inline-block;
  padding: 4px 8px;
  background: white;
  border: 1px solid #333;
  border-radius: 8px;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  cursor: pointer;
}
.custom-tooltip {
  background: white;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.3);
  pointer-events: none;
}
.hover-popup {
  text-align: center;
}
.popup-img {
  display: block;
  width: 140px;
  height: auto;
  border-radius: 4px;
  margin: 0 auto 4px;
}
.popup-title {
  margin: 0;
  font-size: 0.9rem;
}
</style>
