<template>
    <div class="container-fluid">
      <div class="row">
        <!-- Side Menu -->
      <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <!-- Budget Buttons -->
        <a
          v-for="budget in budgets"
          :key="budget._id"
          @click="selectBudget(budget)"
          class="budget-box"
        >
          {{ budget.name }}
        </a>
        <!-- Add space below each budget button -->
        <div class="budget-space"></div>
      </nav>

        <!-- Main Content -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-4">
          <!-- Header and Categories Section -->

          <!-- Display categories for the selected budget -->
          <div v-if="selectedBudget">
            <!-- Show selected budget's name -->
            <h2 class="text-center">{{ selectedBudget.name }}</h2>

            <!-- Create boxes for selectedBudgetCategories -->
            <div v-for="category in selectedBudgetCategories" :key="category._id" class="category-box">
              {{ category.name }}
            </div>
          </div>

          <!-- Categories Section -->
          <div v-if="categories.length > 0">
            <h2>Categories</h2>
            <ul>
              <li v-for="category in categories" :key="category._id">
                {{ category.name }} - Amount: {{ category.amount }}
              </li>
            </ul>
          </div>
        </main>
      </div>

      <!-- Combined Footer (positioned at the bottom) -->
      <footer class="fixed-bottom text-center" style="background-color: #333; color: #fff; padding: 10px;">
        <p>&copy; DoughFlow Dashboard</p>
        <a href="/">Home</a>
      </footer>
    </div>
  </template>

  <!-- ... rest of your script and style tags ... -->

<script>
import axios from 'axios'

export default {
  data() {
    return {
      budgets: [], // Store user's budgets here
      selectedBudget: null, // Store the selected budget
      categories: [], // Store fetched categories here
      selectedBudgetCategories: [] // Store categories for the selected budget
    }
  },
  created() {
    this.fetchBudgets()
  },
  methods: {
    async fetchBudgets() {
      try {
        const response = await axios.get('http://localhost:3000/budgets') // Adjust the API endpoint as needed
        this.budgets = response.data // Assuming your API response structure is an array of budgets
      } catch (error) {
        console.error('Error fetching budgets:', error)
      }
    },
    async fetchCategories() {
      try {
        if (!this.selectedBudget) return // Ensure a budget is selected
        // Replace with your API endpoint URL to fetch categories for the selected budget
        const response = await axios.get('http://localhost:3000/budgets/:id/categories') // Adjust the API endpoint as needed
        this.selectedBudgetCategories = response.data.categories // Assuming your API response structure
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    selectBudget(budget) {
      this.selectedBudget = budget
      // Fetch and display categories for the selected budget here
      this.fetchCategories()
    }
  }
}
</script>

  <style scoped>
  /* Custom styles for the sidebar and background */
  .container-fluid {
    background-color: rgb(52, 192, 239);
    min-height: 100vh;
  }

  /* Sidebar styles */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  /* Style for the budget boxes */
  .budget-box {
    cursor: pointer;
    padding: 10px;
    margin: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* Style for the category boxes */
  .category-box {
    padding: 10px;
    margin: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* Add space below the cards */
  .card {
    margin-bottom: 20px; /* Adjust the margin as needed */
  }

  /* Custom style for spacing below each budget button */
  .budget-space {
  margin-bottom: 30px; /* Adjust the margin as needed */
  }
  </style>
