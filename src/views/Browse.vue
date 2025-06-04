<template>
  <div class="search-page">
    <header class="banner">
      <h1>Browse Places</h1>
    </header>

    <div class="content">
      <aside class="sidebar">
        <section class="filter-section">
          <h2>Search by Keyword</h2>
          <div class="search-input-container">
            <i class="fas fa-search search-icon-sidebar"></i>
            <input
              type="text"
              class="search-input-sidebar"
              placeholder="e.g., city, street, feature..."
              v-model="searchText"
              @keyup.enter="applyFilters" />
          </div>
        </section>

        <section class="filter-section">
          <h2>Dates</h2>
          <div class="calendar-input-wrapper">
            <div class="date-range-display-sidebar" @click.stop="toggleDatePicker">
              <span v-if="rangeDateChosen">
                {{ formatDateToYYYYMMDD(rangeDateChosen.start) }} - {{ formatDateToYYYYMMDD(rangeDateChosen.end) }}
              </span>
              <span v-else>Select Dates</span>
            </div>
            <div class="calendar-icon-container-sidebar" @click.stop="toggleDatePicker">
              <i
                class="fas fa-calendar-alt calendar-icon-sidebar"
                ref="calendarIcon"
              ></i>
              <i
                v-if="rangeDateChosen !== null"
                class="fas fa-circle-check checkmark-overlay-icon"
              ></i>
            </div>
          </div>
        </section>
        <section class="filter-section">
          <h2>Price by hour</h2>
          <div class="price-range-display">
            €{{ priceRange[0] }} - €{{ priceRange[1] }}
          </div>
          <Slider
            v-model="priceRange"
            :min="minAllowedPrice"
            :max="maxAllowedPrice"
            :step="1"
            :tooltip="true"
            class="price-slider"
          />
        </section>

        <section class="filter-section">
          <h2>Tags</h2>
          <div class="tag-option" v-for="tagLabel in [
  'EV Charging Available',
  '24/7 Access',
  'Underground Parking',
  'Covered Parking',
  'Gated Entry',
  'CCTV Surveillance',
  'Large Vehicle Friendly',
  'Motorcycle Parking',
  'Disabled Access'
]" :key="tagLabel">
  <label>
    <input
      type="checkbox"
      :value="tagLabel"
      v-model="selectedTags"
    />
    {{ tagLabel }}
  </label>
</div>
        </section>

        <button @click="applyFilters" class="apply-filters-button">Apply Filters</button>
      </aside>

      <main class="products">
        <router-link
          v-for="item in displayedArticles"
          :key="item.id"
          :to="{
            name: 'article',
            params: { id: item.id },
            query: rangeDateChosen
              ? {
                  start: formatDateToYYYYMMDD(rangeDateChosen.start),
                  end:   formatDateToYYYYMMDD(rangeDateChosen.end)
                }
              : {}
          }"
          class="product-item"
        >
          <img :src="item.image[0]" :alt="item.title" class="item-img" />

          <div class="item-info">
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-address">{{ item.address }}</p>
            <div class="item-rating">
              <i
                v-for="n in 5"
                :key="n"
                :class="n <= item.grade ? 'fas fa-star' : 'far fa-star'"
              ></i>
            </div>
          </div>

          <div class="item-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <p class="item-price">{{ item.price }} € /h</p>
        </router-link>
      </main>
    </div>
  </div>

  <teleport to="body">
    <div
      v-if="showDatePicker"
      class="datepicker-wrapper"
      :style="pickerStyles"
      ref="datePickerRef"
    >
      <DateRangePicker @confirm="handleDateSelection"/>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'; // Added 'watch'
import Slider from '@vueform/slider';
import '@vueform/slider/themes/default.css';
import articlesData from '../data/articles.js';
import DateRangePicker from './DateRangePicker.vue';
import { useRouter } from 'vue-router'; // Needed for initial query parsing

// --- Reactive State for Products ---
const products = ref(articlesData); // Original unfiltered data
const displayedArticles = ref([]); // Will hold the currently filtered articles

// --- State for Price Slider ---
const minAllowedPrice = 0;
const maxAllowedPrice = 5;
const priceRange = ref([minAllowedPrice, maxAllowedPrice]);

// --- State for Search Bar and Date Picker ---
const showDatePicker = ref(false);
const calendarIcon = ref(null); // Ref for the calendar icon in the sidebar
const datePickerRef = ref(null);
const rangeDateChosen = ref(null);
const searchText = ref('');
const selectedTags = ref([])
const pickerStyles = ref({});

// --- Functions for Date Picker ---
function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value;
  if (showDatePicker.value) {
    nextTick(positionPicker);
  }
}

function positionPicker() {
  const iconRect = calendarIcon.value.getBoundingClientRect();
  pickerStyles.value = {
    position: 'absolute',
    top: `${iconRect.bottom + window.scrollY + 4}px`,
    left: `${iconRect.left + window.scrollX}px`,
    zIndex: 9999,
  };
}

function onClickOutside(e) {
  const pop = datePickerRef.value;
  const icon = calendarIcon.value;
  if (
    showDatePicker.value &&
    pop &&
    icon &&
    !pop.contains(e.target) &&
    !icon.contains(e.target)
  ) {
    showDatePicker.value = false;
  }
}

function handleDateSelection(range) {
  rangeDateChosen.value = range;
  showDatePicker.value = false;
  console.log('Selected range:', rangeDateChosen.value);
  // Filtering will happen when 'Apply Filters' is clicked
}

// Helper function to format a Date object into YYYY-MM-DD
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- Unified Filtering Logic ---
const applyAllFilters = () => {
  let filtered = products.value; // Start with the full list of products

  // 1. Filter by search text
  if (searchText.value.trim() !== '') {
    const searchLower = searchText.value.trim().toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.address.toLowerCase().includes(searchLower) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }

  // 2. Filter by date range (Requires date properties in articles.js)
  // 2. Filter by date range
if (rangeDateChosen.value?.start && rangeDateChosen.value?.end) {
  const chosenStart = rangeDateChosen.value.start.getTime()
  const chosenEnd   = rangeDateChosen.value.end.getTime()

  filtered = filtered.filter(item => {
    // if no reservedDates property, treat as fully available
    if (!item.reservedDates?.length) return true

    // keep item only if none of its reserved ranges overlap the chosen range
    return !item.reservedDates.some(({ start, end }) => {
      const rs = new Date(start).getTime()
      const re = new Date(end).getTime()
      return rs <= chosenEnd && re >= chosenStart
    })
  })
  }

  // 3. Filter by price range
  filtered = filtered.filter(item =>
    item.price >= priceRange.value[0] && item.price <= priceRange.value[1]
  );

  if (selectedTags.value.length) {
    filtered = filtered.filter(item =>
      selectedTags.value.every(tag => item.tags.includes(tag))
    )
  }


  displayedArticles.value = filtered; // Update the displayed articles
};

// 'Apply Filters' button handler
const applyFilters = () => {
  console.log('Applying all filters...');
  applyAllFilters();
};

// --- Initial setup and lifecycle hooks ---
onMounted(() => {
  document.addEventListener('click', onClickOutside);

  // Apply initial filters based on URL query parameters (if any)
  const route = useRouter().currentRoute.value;
  if (route.query.text) {
      searchText.value = route.query.text;
  }
  if (route.query.start && route.query.end) {
      rangeDateChosen.value = {
          start: new Date(route.query.start),
          end: new Date(route.query.end)
      };
  }
  // Immediately apply filters on mount to show results from direct URL or initial state
  applyAllFilters();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
});
</script>

<style scoped>
/* Your existing general styles */
.search-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.banner {
  background-color: lightgreen;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  flex-shrink: 0;
}

.banner h1 {
  margin: 0;
  font-size: 1.5rem;
}

/* --- START: Copied Search Overlay Styles from Home.vue --- */
.search-overlay {
  position: relative; /* Changed from absolute to relative to place it in flow */
  /* Remove bottom, left, transform as it's no longer overlaying the hero image */
  margin: 1rem auto; /* Center it with margins */
  width: 80%;
  max-width: 600px;
  padding: 0.75rem 1rem;

  display: flex;
  align-items: center;

  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 2; /* Ensure it's above other content if needed */
}

.search-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
  color: #666;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}

.calendar-icon {
  font-size: 1.25rem;
}

.checkmark-overlay-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  color: #42b983;
  font-size: 0.8em;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
}

.calendar-icon-container {
  position: relative;
  margin: 0 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.search-button {
  border: none;
  outline: none;
  background-color: #42b983;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

.search-button:disabled {
  background-color: #a6d9be;
  color: #e0e0e0;
  cursor: not-allowed;
  opacity: 0.7;
  box-shadow: none;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 280px;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.filter-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.filter-section h2 {
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #333;
}

.price-range-display {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #555;
  font-size: 1.1rem;
}

.price-slider {
  margin-top: 20px;
  margin-bottom: 25px;
}

.apply-filters-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.apply-filters-button:hover {
  background-color: #36a070;
}

.products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem; /* Consistent with Home.vue featured-grid */
  padding: 20px;
  overflow-y: auto;
  align-content: flex-start;
}

/* --- Start of copied product-item styles (formerly featured-item) --- */

/* Card container (now .product-item) */
.product-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* top image */
.item-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* info block */
.item-info {
  padding: 0.75rem 1rem;
}
.item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
}
.item-address {
  margin: 0.25rem 0;
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}
.item-rating {
  text-align: right;
}
.item-rating i {
  margin-left: 2px;
  color: #fdd835;
}
.item-rating .far {
  color: #ccc;
}

/* price at bottom-right */
.item-price {
  margin: 0.75rem 1rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
}

/* Styles for tags */
.item-tags {
  padding: 0.5rem 1rem;
}

.tag {
  display: block;
  background-color: #e0e0e0;
  color: #555;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 5px;
}

.tag:last-child {
  margin-bottom: 0;
}
/* --- End of copied product-item styles --- */

.tag-option {
  margin-bottom: 8px;
}

.tag-option label {
  display: flex;
  align-items: center;
}

.tag-option input[type="checkbox"] {
  margin-right: 8px;
}
</style><style scoped>
/* Your existing general styles */
.search-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.banner {
  background-color: lightgreen;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  flex-shrink: 0;
}

.banner h1 {
  margin: 0;
  font-size: 1.5rem;
}

/* Old .search-overlay styles are now removed from here */
/* .search-overlay { ... } */

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 280px;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
  display: flex; /* Make sidebar a flex container for better button positioning */
  flex-direction: column; /* Stack its contents vertically */
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.filter-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.filter-section h2 {
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #333;
}

/* --- START: New Sidebar Search & Calendar Styles --- */
.search-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px 10px;
  background-color: #fff;
  margin-bottom: 10px; /* Space below search input */
}

.search-icon-sidebar {
  margin-right: 8px;
  color: #888;
}

.search-input-sidebar {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  background: transparent;
  padding: 0; /* Remove default input padding */
}

.calendar-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between display and icon */
}

.date-range-display-sidebar {
  flex-grow: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #555;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendar-icon-container-sidebar {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.calendar-icon-sidebar {
  font-size: 1.25rem;
  color: #555;
}

/* Checkmark overlay icon remains the same relative to its parent container */
.checkmark-overlay-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  color: #42b983;
  font-size: 0.8em;
  background-color: white;
  border-radius: 50%;
  padding: 2px;
}
/* --- END: New Sidebar Search & Calendar Styles --- */


.price-range-display {
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #555;
  font-size: 1.1rem;
}

.price-slider {
  margin-top: 20px;
  margin-bottom: 25px;
}

.apply-filters-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  margin-top: auto; /* Pushes the button to the bottom of the flex container (sidebar) */
  flex-shrink: 0; /* Prevent it from shrinking */
}

.apply-filters-button:hover {
  background-color: #36a070;
}

.products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  padding: 20px;
  overflow-y: auto;
  align-content: flex-start;
}

/* Copied product-item styles (formerly featured-item) - remain unchanged from previous step */
.product-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}
.product-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.item-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
.item-info {
  padding: 0.75rem 1rem;
}
.item-title {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
}
.item-address {
  margin: 0.25rem 0;
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}
.item-rating {
  text-align: right;
}
.item-rating i {
  margin-left: 2px;
  color: #fdd835;
}
.item-rating .far {
  color: #ccc;
}
.item-price {
  margin: 0.75rem 1rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
}
.item-tags {
  padding: 0.5rem 1rem;
}
.tag {
  display: block;
  background-color: #e0e0e0;
  color: #555;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
  white-space: nowrap;
  margin-bottom: 5px;
}
.tag:last-child {
  margin-bottom: 0;
}
/* --- End of copied product-item styles --- */

.tag-option {
  margin-bottom: 8px;
}
.tag-option label {
  display: flex;
  align-items: center;
}
.tag-option input[type="checkbox"] {
  margin-right: 8px;
}
</style>