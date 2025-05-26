<template>
  <div class="login-container">
    <div class="avatar-container">
      <!-- Replace src with the actual user picture URL -->
      <!-- <img src="user-avatar.jpg" alt="User Avatar" /> -->
      <img :src="userAvatar" alt="User Avatar" />
    </div>
    <form @submit.prevent="login">
      
      <div class="input-wrapper">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />
      <!-- error inline container -->
      <div
        v-if="email !== '' && !isValidEmail"
        class="error-inline"
        aria-live="polite"
      >
        <span class="error-icon">&#10005;</span>
        <span class="error-text">Invalid email</span>
      </div>
    </div>


      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
      </div>
      <button :disabled="!canLogin" type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import userAvatar from '../assets/images/user.png'

const email = ref('');
const password = ref('');

// Simple email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = computed(() => emailRegex.test(email.value));

// Enable login only if both fields are filled and email is valid
const canLogin = computed(() => {
  return email.value !== '' && password.value !== '' && isValidEmail.value;
});

function login() {
  // Handle login logic here
  console.log('Logging in with:', email.value);
}
</script>

<style scoped>
.login-container {
  width: 320px;
  margin: 80px auto;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}


.input-wrapper {
  margin-bottom: 16px;
  text-align: left;
}

.input-wrapper label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.input-wrapper input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 14px;
}



.error-icon {
  font-size: 14px;
  color: #e53e3e;
}

/* the text */
.error-text {
  font-size: 15px;
  margin-left: 4px;
  color: #e53e3e;
}

.avatar-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
}

.avatar-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
}

.form-group {
  margin-bottom: 16px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  background-color: #3182ce;
  color: #ffffff;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #2c5282;
}
</style>
