<template>
  <div class="hero">
    <img :src="heroImage" alt="Hero" class="hero-img" />

    <div class="search-overlay">
      <i class="fas fa-search search-icon"></i>
      <input
        type="text"
        class="search-input"
        placeholder="Search..."
        v-model="searchText"
      />
      <div class="calendar-icon-container">
        <i
          class="fas fa-calendar-alt calendar-icon"
          ref="calendarIcon"
          @click.stop="toggleDatePicker"
        ></i>
        <i
          v-if="rangeDateChosen !== null"
          class="fas fa-circle-check checkmark-overlay-icon"
        ></i>
      </div>
      <button class="search-button" :disabled="isSearchButtonDisabled" @click="handleSearch">Search</button>
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

  <section class="icon-block">
    <div class="icon-row">
      <div class="icon-item">
        <i class="fas fa-square-parking"></i>
        <span class="icon-text">Easily find parking spaces for your vacations, concerts or vents</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-star"></i>
        <span class="icon-text">Find the best spots in a few clicks</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-heart"></i>
        <span class="icon-text">
          <transition name="count" mode="out-in">
            <span class="count-number" :key="peopleCount">{{ peopleCount }}</span>
          </transition>
          People satisfied
        </span>
      </div>
    </div>

    <div class="icon-row">
      <div class="icon-item">
        <i class="fas fa-champagne-glasses"></i>
        <span class="icon-text">Browse and find events around you</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-message"></i>
        <span class="icon-text">Get in direct contact with the owner</span>
      </div>
      <div class="icon-item">
        <i class="fas fa-coins"></i>
        <span class="icon-text">Rent your parking spot easily</span>
      </div>
      </div>
  </section>

  <div>
    <h1>Events</h1>
  </div>

  <section class="event-banner">
    <div class="carousel">
      <div
        class="carousel-track"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          class="carousel-item"
          v-for="(img, i) in eventImages"
          :key="i"
        >
          <img :src="img.src" :alt="img.title" class="banner-img" />
          <div class="banner-title">{{ img.title }}</div>
        </div>
      </div>
      <button class="carousel-control prev" @click="prev">
        &#10094;
      </button>
      <button class="carousel-control next" @click="next">
        &#10095;
      </button>
    </div>
  </section>

  <div>
    <h1>Featured</h1>
    <p>Here are the top spots for you:</p>
  </div>

  <section class="featured">
    <div class="featured-grid">
      <router-link
        v-for="item in featuredItems"
        :key="item.id"
        :to="{ name: 'article', params: { id: item.id } }"
        class="featured-item"
      >
        <img :src="item.image[0]" alt="" class="item-img" />

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
    </div>
  </section>

  </template>

<script setup>
import heroImage from '../assets/images/mountain.jpg'

import { useRouter } from 'vue-router' 

//==================================


import articles from '../data/articles.js'

// use all articles, or filter/slice for “featured”
const featuredItems = articles

import { ref, nextTick, onMounted, onBeforeUnmount, computed} from 'vue'
import DateRangePicker from './DateRangePicker.vue'   //Added

// state & refs

// Initialize useRouter
const router = useRouter()
const showDatePicker = ref(false)
const calendarIcon = ref(null)
const datePickerRef = ref(null)
const rangeDateChosen = ref(null)
const searchText = ref('')
// style object for inline positioning
const pickerStyles = ref({})
// toggle visibility
function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value

  // after it’s rendered, compute its absolute position
  if (showDatePicker.value) {
    nextTick(positionPicker)
  }
}
// compute the popup’s coordinates based on the icon
function positionPicker() {
  const iconRect = calendarIcon.value.getBoundingClientRect()
  pickerStyles.value = {
    position: 'absolute',
    top: `${iconRect.bottom + window.scrollY + 4}px`,
    left: `${iconRect.left + window.scrollX}px`,
    zIndex: 9999
  }
}
// close if you click anywhere else
function onClickOutside(e) {
  const pop = datePickerRef.value
  const icon = calendarIcon.value
  if (
    showDatePicker.value &&
    pop &&
    icon &&
    !pop.contains(e.target) &&
    !icon.contains(e.target)
  ) {
    showDatePicker.value = false
  }
}

function handleDateSelection(range) {
  rangeDateChosen.value=range;
  showDatePicker.value = false;
  console.log('Selected range:', rangeDateChosen.value);
}

// COMPUTED PROPERTY FOR BUTTON DISABLING
const isSearchButtonDisabled = computed(() => {
  // Check if search text is empty AND rangeDateChosen is null
  return searchText.value.trim() === '' && rangeDateChosen.value === null;
});

// Helper function to format a Date object into YYYY-MM-DD (local time)
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed (0-11)
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleSearch = () => {
  if (isSearchButtonDisabled.value) {
    // Optionally, alert the user or do nothing if button is disabled
    console.log('Search button is disabled. Please enter text or select dates.');
    return;
  }

  const queryParams = {};
  if (searchText.value.trim() !== '') {
    queryParams.text = searchText.value.trim();
  }

  // Add date range if selected
  if (rangeDateChosen.value && typeof rangeDateChosen.value === 'object' && rangeDateChosen.value.start && rangeDateChosen.value.end) {
    const { start: startDate, end: endDate } = rangeDateChosen.value;

    // Check if they are valid Date objects before trying to format
    if (startDate instanceof Date && !isNaN(startDate) && endDate instanceof Date && !isNaN(endDate)) {
      queryParams.start = formatDateToYYYYMMDD(startDate);
      queryParams.end = formatDateToYYYYMMDD(endDate);
    }
  }
  router.push({ name: 'Browse', query: queryParams });
};


onMounted(() => {
  document.addEventListener('click', onClickOutside)
  startTimer()    //Carousel
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  clearInterval(timer)  //Carousel
})

// import your real images here, or use dynamic require
// import img1 from '../assets/images/img1.jpg'
// ...


const eventImages = [
  { src: '/images/event_1.jpg', title: 'John Williams & Hans Zimmer - Symphonic concert' },
  { src: '/images/event_2.jpg', title: 'Wicked love - Tour d’Argent' },
  { src: '/images/event_3.jpg', title: 'MJ The musical - Spectacle ' },
  // …etc…
]
const currentIndex = ref(0)
let timer = null

const peopleCount = ref(53472)
function updatePeopleCount() {
  // increment by a random integer 3–15
  const inc = Math.floor(Math.random() * (15 - 3 + 1)) + 3
  peopleCount.value += inc
}

function next() {
  currentIndex.value = (currentIndex.value + 1) % eventImages.length
  resetTimer()
}

function prev() {
  currentIndex.value =
    (currentIndex.value - 1 + eventImages.length) % eventImages.length
  resetTimer()
}

function startTimer() {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % eventImages.length

    updatePeopleCount()
  }, 8000)
}

function resetTimer() {
  clearInterval(timer)
  startTimer()
}

/*
// for demo, using placeholder images:
const featuredItems = [
  { image: 'https://picsum.photos/id/26/200/300', description: 'Charming alpine chalet' },
  { image: 'https://via.placeholder.com/300x200?text=Item+2', description: 'Cozy city apartment' },
  { image: 'https://via.placeholder.com/300x200?text=Item+3', description: 'Beachside bungalow' },
  { image: 'https://via.placeholder.com/300x200?text=Item+4', description: 'Rustic countryside lodge' },
  { image: 'https://via.placeholder.com/300x200?text=Item+5', description: 'Modern loft downtown' },
  { image: 'https://via.placeholder.com/300x200?text=Item+6', description: 'Secluded forest cabin' },
  { image: 'https://via.placeholder.com/300x200?text=Item+7', description: 'Luxury villa with pool' },
  { image: 'https://via.placeholder.com/300x200?text=Item+8', description: 'Historic castle suite' },
  { image: 'https://via.placeholder.com/300x200?text=Item+9', description: 'Contemporary studio flat' },
  { image: 'https://via.placeholder.com/300x200?text=Item+10', description: 'Desert glamping dome' },
  { image: 'https://via.placeholder.com/300x200?text=Item+11', description: 'Lakefront cottage' },
  { image: 'https://via.placeholder.com/300x200?text=Item+12', description: 'Mountain-view yurts' },
]*/
</script>

<style scoped>
.hero {
  position: relative;    /* establish a positioning context */
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* ——— Search overlay ——— */
.search-overlay {
  position: absolute;             
  bottom: 2rem;                   
  left: 50%;                      
  transform: translateX(-50%);    
  z-index: 2;                     

  display: flex;
  align-items: center;
  width: 80%;
  max-width: 600px;
  padding: 0.75rem 1rem;

  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  /* No special styles needed here */
}

.checkmark-overlay-icon {
  position: absolute; /* Position absolutely relative to its wrapper */
  bottom: -5px; /* Adjust as needed to position below */
  right: -5px; /* Adjust as needed to position to the right/left */
  color: #42b983;
  font-size: 0.8em; /* Make it smaller */
  background-color: white; /* Optional: A small background to make it pop */
  border-radius: 50%; /* Optional: Round background */
  padding: 2px; /* Optional: Padding for the background */
}

.calendar-icon-container {
  position: relative; /* THIS IS CRUCIAL: Makes it the positioning context for absolute children */
  margin: 0 0.75rem; /* Space the container from input/button */
  cursor: pointer; /* Makes the entire area clickable for the date picker */
  /* If you want the icons themselves to be aligned horizontally within this container,
     you might add: */
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
 transition: background-color 0.3s ease, opacity 0.3s ease; /* Add transition for smoothness */
}

/* --- Styles for the disabled state --- */
.search-button:disabled {
  background-color: #a6d9be; /* A lighter shade of your active color */
  color: #e0e0e0; /* Lighter text color */
  cursor: not-allowed; /* Change cursor to indicate non-interactable */
  opacity: 0.7; /* Make it slightly transparent */
  box-shadow: none; /* Remove any active button shadows */
}

/* ——— Featured grid styles ——— */
.featured {
  margin: 2rem 1rem;
}
.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* card container */
.featured-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform .2s;
}
.featured-item:hover {
  transform: translateY(-4px);
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
}

/* price at bottom-right */
.item-price {
  margin: 0.75rem 1rem 1rem;
  font-weight: bold;
  font-size: 1rem;
  text-align: right;
}

.item-tags {
  padding: 0.5rem 1rem; /* Padding similar to item-info */
}

.tag {
  display: block;
  background-color: #e0e0e0; /* Light grey background */
  color: #555; /* Darker grey text */
  padding: 3px 8px; /* Padding inside each tag */
  border-radius: 5px; /* Slightly rounded corners */
  font-size: 0.75rem; /* Smaller font size for tags */
  white-space: nowrap; /* Prevents text inside a tag from wrapping */
  margin-bottom: 5px;
}

/** Carousel */

.event-banner {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 400px; /* adjust as needed */
  margin: 2rem 0;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s ease-in-out;
  height: 100%;
}

.carousel-item {
  min-width: 100%;
  position: relative;
  height: 100%;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-title {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
}

/* —— Controls —— */
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 2rem;
  padding: 0 0.5rem;
  cursor: pointer;
  user-select: none;
  z-index: 2;
}

.carousel-control.prev {
  left: 1rem;
}

.carousel-control.next {
  right: 1rem;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.6);
}


/** Icons */
.icon-block {
  margin: 6rem auto 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  max-width: 800px;
  width: 100%;
}

.icon-row {
  display: grid;
  width: 100%;
  /* evenly split into 4 columns of equal width */
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;            /* space between columns */
}

.icon-item {
  display: flex;
  align-items: flex-start;   /* icon at top of its cell */
}

.icon-item i {
  font-size: 2.5rem;
  margin-right: 0.6rem;
  flex-shrink: 0;            /* keep icon from shrinking when text wraps */
}

.icon-text {
  font-size: 1rem;
  color: #333;
  /* allow wrapping inside the grid cell */
  word-break: break-word;
  line-height: 1.3;
}




/* count transition */
.count-number {
  display: inline-block;
  margin-left: 0.25rem;
}

/* enter: from invisible & up; to visible & in-place */
.count-enter-active {
  transition: all 0.6s ease;
}
.count-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.count-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* optional: fade-out downward if you ever remove the count */
.count-leave-active {
  transition: all 0.6s ease;
}
.count-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.count-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

</style>
