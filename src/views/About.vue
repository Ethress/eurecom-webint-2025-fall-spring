<template>
  <div class="about-page p-8 max-w-4xl mx-auto">
    <h1 class="text-4xl font-bold mb-4">About Us</h1>
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">Our Mission</h2>
      <p>{{ mission }}</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">Our Vision</h2>
      <p>{{ vision }}</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">Our History</h2>
      <p>{{ history }}</p>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">Our Team</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="member in teamMembers" :key="member.id" class="team-member p-4 border rounded-lg shadow-sm">
          <img :src="member.photo" alt="Photo of {{ member.name }}" class="w-full h-48 object-cover rounded-md mb-4" />
          <h3 class="text-xl font-medium">{{ member.name }}</h3>
          <p class="text-gray-600">{{ member.role }}</p>
          <p class="mt-2 text-gray-700">{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-2">Contact Information</h2>
      <ul>
        <li><strong>Address:</strong> {{ contact.address }}</li>
        <li><strong>Phone:</strong> {{ contact.phone }}</li>
        <li><strong>Email:</strong> <a :href="`mailto:${contact.email}`" class="text-blue-600">{{ contact.email }}</a></li>
        <li><strong>Website:</strong> <a :href="contact.website" target="_blank" class="text-blue-600">{{ contact.website }}</a></li>
      </ul>
    </section>

    <section>
      <h2 class="text-2xl font-semibold mb-2">Follow Us</h2>
      <ul class="flex space-x-4">
        <li><a :href="social.twitter" target="_blank">Twitter</a></li>
        <li><a :href="social.facebook" target="_blank">Facebook</a></li>
        <li><a :href="social.linkedin" target="_blank">LinkedIn</a></li>
        <li><a :href="social.instagram" target="_blank">Instagram</a></li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mission = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.')
const vision = ref('Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.')
const history = ref('Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla.')

const teamMembers = ref([
  {
    id: 1,
    name: 'Alice Example',
    role: 'Lead Developer',
    photo: 'https://via.placeholder.com/300x200',
    bio: 'Alice has over 10 years of experience in front-end development and is our Vue.js expert.'
  },
  {
    id: 2,
    name: 'Bob Sample',
    role: 'UI/UX Designer',
    photo: 'https://via.placeholder.com/300x200',
    bio: 'Bob specializes in creating intuitive and engaging user interfaces.'
  }
])

const contact = ref({
  address: '1234 Main St, Anytown, Country',
  phone: '+123 456 7890',
  email: 'info@example.com',
  website: 'https://www.example.com'
})

const social = ref({
  twitter: 'https://twitter.com/example',
  facebook: 'https://facebook.com/example',
  linkedin: 'https://linkedin.com/company/example',
  instagram: 'https://instagram.com/example'
})
</script>

<style scoped>
.about-page {
  font-family: Arial, sans-serif;
  color: #333;
}
.team-member img {
  object-fit: cover;
}
</style>
