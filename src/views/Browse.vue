<template>
  <div class="search-page">
    <header class="banner">
      <h1>Search place</h1>
    </header>

    <div class="content">
      <aside class="sidebar">
        <!-- Price Selection -->
        <section class="filter-section">
          <h2>Price</h2>
          <select>
            <option>Any</option>
            <option>€0 - €50</option>
            <option>€50 - €100</option>
            <option>€100+</option>
          </select>
        </section>

        <!-- Tag Selection -->
        <section class="filter-section">
          <h2>Tags</h2>
          <label><input type="checkbox" /> Free Wi-Fi</label>
          <label><input type="checkbox" /> Breakfast Included</label>
          <label><input type="checkbox" /> Pool</label>
        </section>

        <!-- Add more filters as needed -->
      </aside>

      <main class="products">
        <div
          class="product-card"
          v-for="item in products"
          :key="item.id"
        >
          <img :src="item.image" alt="item.title" class="product-image" />
          <div class="product-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <p class="price">€{{ item.price }}</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  data() {
    return {
      products: [
        {
          id: 1,
          title: 'Cozy Studio',
          description: 'Central location, near metro.',
          price: 75,
          image: 'https://via.placeholder.com/200x150'
        },
        {
          id: 2,
          title: 'Sea View Apartment',
          description: 'Beautiful view of the sea.',
          price: 120,
          image: 'https://via.placeholder.com/200x150'
        },
        /* ... more products ... */
      ]
    }
  }
}
</script>

<style scoped>
.search-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 250px;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
  border-right: 1px solid #ddd;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h2 {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.products {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
}

.product-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-info h3 {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.price {
  font-weight: bold;
  margin-top: auto;
}
</style>
