# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

## Prerequisites

- **Node.js** ≥ 14.x
- **npm** ≥ 6.x

## Installation

Clone the repo
```bash
git clone https://github.com/Ethress/eurecom-webint-2025-fall-spring.git
cd eurecom-webint-2025-fall-spring
```

Install dependencies
```bash
npm install
```

## Run demo

```bash
npm run dev
```

Features

- General features

- Home page
    - [x] Dynamic date picker when clicking on the calendar
    - [x] For date picker: Select button, different color for beginning/end, keep choice in memory when sending
    - [x] Make the search bar functional (redirect to Browse + add args to url)
    - [x] Disable search bar when no date/input field are entered
    - [x] Added checkmark for when we have selected a date

- About page
    - [x] Modify content
- Contact page
    - [ ] Modify content
- Map page
    /!\ Started to build the template
    - [x] Have an interactive map
    - [x] Display prices of spots on the map
        - [x] Widgets take you to the correct article when clicked
        - [x] Hovering over it displays the picture + title of that article
    - [x] Add sidebar on the left with all articles on top of the other like on this [website](https://blog.mapbox.com/search-for-your-next-apartment-with-rentpath-34ac78d31d52)
- Browse page
    /!\ Started to build the template 
    - On the left:
        - [x] Sidebar with tags (with checkboxes)
        - [x] A price range similar to this [website](https://stock.adobe.com/fr/images/price-range-filter-in-modern-style-for-your-ui-ux-design-vector-illustration/486137596)
- Article page
    - [x] Create article page dynamically according to its id
    - [x] Centered on top should be the picture of the article, arrows on the left and right to see more pictures if there are (with whte dots to see at what index we are)
        - [ ] Add the possibility to play a video ??
    - [x] Add content for each articles, under the picture should be the title, price, grade, lcation, etc like on this [website](https://www.seloger.com/annonces/locations/parking/antibes-06/les-combes/235661643.htm?ln=classified_search_results&serp_view=list&search=distributionTypes%3DRent%26estateTypes%3DParking%26locations%3DAD08FR1954%26order%3DDateDesc&m=classified_search_results_classified_classified_detail_L)
        - [x] It would be nice to have a little map zoomed in on the location of the parking with a marker
- Login page
    - [x] Use regex to check mail validity
    - [x] Hidden password field
    - [x] Login button disabled when either fields ar empty / invalid
- Possibly add an extra page ?


Packages installed:
npm install vue-router@4
npm install --save @fortawesome/fontawesome-free
npm install leaflet


npm install vue-slider-component
npm install primevue
npm install primeicons