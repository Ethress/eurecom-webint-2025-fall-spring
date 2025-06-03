<template>
  <div class="about-container">
    <div class="about-card">
      <h1 class="about-title">About Us</h1>

      <section class="about-section mission">
        <h2>Our Mission</h2>
        <p>{{ mission }}</p>
      </section>

      <section class="about-section vision">
        <h2>Our Vision</h2>
        <p>{{ vision }}</p>
      </section>

      <section class="about-section">
        <h2>Our History</h2>
        <p>{{ history }}</p>
      </section>

      <section class="about-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div class="team-member" v-for="member in teamMembers" :key="member.id">
            <img :src="member.photo" :alt="`Photo of ${member.name}`" />
            <h3>{{ member.name }}</h3>
            <p class="role">{{ member.role }}</p>
            <p>{{ member.bio }}</p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <h2>Contact Information</h2>
        <ul class="contact-list">
          <li><strong>Address:</strong> {{ contact.address }}</li>
          <li><strong>Phone:</strong> {{ contact.phone }}</li>
          <li><strong>Email:</strong> <a :href="`mailto:${contact.email}`">{{ contact.email }}</a></li>
          <li><strong>Website:</strong> <a :href="contact.website" target="_blank">{{ contact.website }}</a></li>
        </ul>
      </section>

      <section class="about-section">
        <h2>FAQ</h2>

        <div class="faq-item">
          <p><strong>How does ParkNest work?</strong></p>
          <p>You search for available parking spots near your destination, select your times, and book — all within seconds. Hosts get notified and you're good to go.</p>
        </div>

        <div class="faq-item">
          <p><strong>Can I list my parking space?</strong></p>
          <p>Absolutely. Anyone with a private parking space — garage, driveway, or reserved lot — can list it on ParkNest and earn money effortlessly.</p>
        </div>

        <div class="faq-item">
          <p><strong>Is ParkNest safe to use?</strong></p>
          <p>Yes. We verify all users and offer reviews, messaging, and support to ensure trust and transparency between drivers and hosts.</p>
        </div>

        <div class="faq-item">
          <p><strong>How much does it cost?</strong></p>
          <p>Prices are set by hosts and vary depending on location, duration, and availability. ParkNest adds a small service fee for maintenance and support.</p>
        </div>

        <div class="faq-item">
          <p><strong>What if I need to cancel?</strong></p>
          <p>You can cancel up to 24 hours before the booking time for a full refund. Hosts may also cancel with prior notice, and our team will help relocate you if needed.</p>
        </div>
      </section>

      <section class="about-section">
        <h2>Follow Us</h2>
        <ul class="social-list">
          <li>
            <a :href="social.twitter" target="_blank" aria-label="Twitter">
              <i class="fab fa-twitter"></i> Twitter
            </a>
          </li>
          <li>
            <a :href="social.facebook" target="_blank" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i> Facebook
            </a>
          </li>
          <li>
            <a :href="social.linkedin" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin-in"></i> LinkedIn
            </a>
          </li>
          <li>
            <a :href="social.instagram" target="_blank" aria-label="Instagram">
              <i class="fab fa-instagram"></i> Instagram
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const mission = ref(
  "At ParkNest, our mission is to reinvent urban mobility by transforming every unused driveway, garage, and private lot into a smart, shareable parking space. We empower individuals and businesses to make the most of their space, reduce traffic congestion, and give drivers back their time and peace of mind. Whether you're looking for a spot for 20 minutes or 20 days — ParkNest makes parking effortless, affordable, and accessible."
)

const vision = ref(
  "We envision a world where searching for parking is a thing of the past. By creating a seamless, decentralized network of on-demand parking spaces, ParkNest aims to reduce pollution, reclaim public space, and make our cities cleaner, calmer, and more connected. Through smart technology and a trusted community, we’re building the future of urban transport — one parking spot at a time."
)

const history = ref(
  "ParkNest was born from frustration. In 2025, our founders were tired of wasting time and fuel circling the block in search of parking. Inspired by the success of peer-to-peer platforms like Airbnb and Blablacar, they imagined a world where parking could be shared, booked in seconds, and trusted. From a basic prototype in a student hackathon to a fully scalable app used by thousands, ParkNest is now expanding across cities, turning wasted space into valuable resources — and stress into simplicity."
)

const teamMembers = ref([
  {
    id: 1,
    name: 'Grégoire Communeau',
    role: 'Chief Technology Officer',
    photo: '/images/communeau-gregoire-guy.jpg',
    bio: 'Grégoire leads product development and platform security at ParkNest'
  },
  {
    id: 2,
    name: 'Clément Dutu',
    role: 'Chief Executive Officer',
    photo: '/images/dutu-clement.jpg',
    bio: 'Clément handles operations, partnerships, and overall vision'
  },
  {
    id: 3,
    name: 'Gabriel Lafont Millet',
    role: 'Head of Marketing & Community',
    photo: '/images/lafont-millet-gabriel.jpg',
    bio: 'Gabriel makes ParkNest shine — online and in the streets'
  },
  {
    id: 4,
    name: 'Alexis Balestra',
    role: 'Lead Backend Engineer',
    photo: '/images/balestra-alexis-benjamin.jpg',
    bio: 'Alexis handles the engine behind the scenes'
  }
])


const contact = ref({
  address: '42 Avenue de la République, 75011 Paris, France',
  phone: '+33 1 23 45 67 89',
  email: 'support@parknest.com',
  website: 'https://www.parknest.com'
})

const social = ref({
  twitter: 'https://twitter.com/parknest',
  facebook: 'https://facebook.com/parknest',
  linkedin: 'https://linkedin.com/company/parknest',
  instagram: 'https://instagram.com/parknest'
})
</script>

<style scoped>
.about-container {
  background-color: #f5f5f5;
  padding: 40px 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

.about-card {
  background-color: white;
  border-radius: 10px;
  max-width: 900px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-title {
  font-size: 48px;
  text-align: center;
  margin-bottom: 40px;
  color: #42b983;
}

.about-section {
  border: 1px solid #ddd;
  background-color: #fafafa;
  padding: 25px 30px;
  margin-bottom: 30px;
  border-radius: 8px;
}

.about-section h2 {
  margin-bottom: 15px;
  font-size: 24px;
  color: #333;
}

.about-section p {
  color: #555;
  line-height: 1.6;
}

.mission {
  border-left: 6px solid rgb(30, 110, 86);
}

.vision {
  border-left: 6px solid #10b981;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.team-member {
  flex: 1 1 45%;
  background: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.team-member img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: block;
}

.team-member h3 {
  margin: 5px 0;
  font-size: 20px;
  color: #111;
}

.team-member .role {
  font-weight: bold;
  color: #42b983;
  margin-bottom: 10px;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.contact-list {
  list-style: none;
  padding: 0;
  color: #444;
}

.contact-list li {
  margin-bottom: 10px;
}

.social-list {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.social-list li a {
  color: #42b983;
  text-decoration: none;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.social-list li a:hover {
  text-decoration: underline;
}

.faq-item {
  margin-bottom: 20px;
}

.faq-item p:first-child {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}
</style>
