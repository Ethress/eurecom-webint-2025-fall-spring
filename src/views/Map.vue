<template>
  <div class="map-wrapper">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import articles from '../data/articles.js'

const mapContainer = ref(null)
const router = useRouter()
let map = null

onMounted(() => {
  map = L.map(mapContainer.value).setView([48.8566, 2.3522], 13)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map)

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

    // the little price badge
    const html = `<div class="price-label">${price}&nbsp;$</div>`
    const icon = L.divIcon({
      className: 'custom-price-icon',
      html,
      iconAnchor: [15, 15],
    })

    // place the marker
    const marker = L.marker([lat, lng], { icon }).addTo(map)

    // bind a tooltip that shows on hover
    const tooltipHtml = `
      <div class="hover-popup">
        <img src="${image[0]}" alt="${title}" class="popup-img"/>
        <h4 class="popup-title">${title}</h4>
      </div>
    `
    marker.bindTooltip(tooltipHtml, {
      direction: 'top',
      offset: [0, -20],
      opacity: 0.9,
      className: 'custom-tooltip',
      sticky: true
    })

    // optional: click to navigate
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



<style>
.map-wrapper {
  display: flex;
  justify-content: center;
}

#map {
  width: 70%;
  height: 80vh;
}

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
  pointer-events: none;        /* so hover stays on marker */
}
.preview-tooltip {
  display: flex;
  align-items: center;
}
.preview-tooltip img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 8px;
}
.preview-title {
  font-size: 0.9rem;
  font-weight: bold;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* new */

.custom-tooltip .leaflet-tooltip-content {
  background: white;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.hover-popup {
  text-align: center;
}

.popup-img {
  display: block;
  width: 150px;
  height: auto;
  border-radius: 4px;
  margin: 0 auto 4px;
}

.popup-title {
  margin: 0;
  font-size: 0.9rem;
}
</style>
