<template>
    <div class="dashboard">
      <main>
        <div class="container mt-4">
          <div class="row">
            <!-- Box 1 -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-body register-expense">
                  <!-- Title-->
                  <h5 class="header-text">Register Expense</h5>
                  <div class="form-group">
                    <div class="input-box">
                    <input type="number" class="form-control" v-model="amount" placeholder="Amount" required>
                    </div>
                  </div>
                  <!-- Dropdown selection-->
                  <div class="form-group">
                    <div class="dropdown-button-container">
                        <select class="form-control category" v-model="categoryId" required>
                        <option disabled value="">Category</option>
                        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.categoryName }}</option>
                      </select>
                      <button class="btn category-popup-button" @click="showPopup = true">+</button>
                    </div>
                  </div>
                  <div v-if="showPopup" class="popup">
                    <div class="form-group">
                      <input class="form-control category-input" v-model="categoryName" @keyup.enter="addCategory" placeholder="New category" />
                      <button class="btn add-category-button" @click="addCategory">Add</button>
                      <button class="btn cancel-button" @click="showPopup = false">Cancel</button>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-box">
                      <input type="text" class="form-control" v-model="description" placeholder="Description" required>
                    </div>
                  </div>
                  <!-- Button in the bottom right corner -->
                  <div class="add-expense-button-container">
                    <button class="btn add-expense-button" @click="addExpense">Add</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Box 2 -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  Circle diagram here
                </div>
              </div>
            </div>
            <!-- Box 3 -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  Bar chart
                </div>
              </div>
            </div>
          </div>
          <!-- Second Row -->
          <div class="row mt-4">
            <!-- Box 4 -->
            <div class="col-md-4">
              <div class="card clickable-box" @click="switchToBudgets">
                <div class="card-body text-center manage-budgets">
                  <h5 class="header-text">Manage Budgets</h5>
                </div>
              </div>
            </div>
            <!-- Box 5 -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  Saved by DoughFlow
                </div>
              </div>
            </div>
            <!-- Box 6 -->
            <div class="col-md-4">
              <div class="card clickable-box" @click="switchToMyAccount">
                <div class="card-body text-center my-account">
                  <h5 class="header-text">My account</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      amount: null,
      description: '',
      categoryId: '',
      categories: [],
      showPopup: false,
      categoryName: ''
    }
  },
  methods: {
    switchToBudgets() {
      this.$router.push('/BudgetManagement')
    },
    switchToMyAccount() {
      this.$router.push('/my-account')
    },
    async addExpense() {
      const currentDate = new Date().toISOString()
      const newExpense = {
        amount: parseFloat(this.amount),
        description: this.description,
        categoryId: this.categoryId,
        date: currentDate
      }
      console.log('Sending expense', newExpense)
      axios
        .post('http://localhost:3000/expenses', newExpense)
        .then(response => {
          console.log('Expense added successfully', response.data)
          this.amount = null
          this.description = ''
          this.categoryId = ''
        })
        .catch(error => {
          console.error('Error adding expense', error)
        })
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/budgets/650aa524cbf9b97224116825/categories')
        this.categories = response.data.categories
        console.log('Fetched categories', this.categories)
      } catch (error) {
        console.error('Error fetching categories', error)
      }
    },
    async addCategory() {
      const newCategory = {
        categoryName: this.categoryName
      }
      axios
        .post('http://localhost:3000/budgets/650aa524cbf9b97224116825/categories', newCategory)
        .then(response => {
          console.log('Category added successfully', response.data)
          this.categoryName = ''
          this.fetchCategories()
        })
        .catch(error => {
          console.error('Error adding category', error)
        })
    }
  },
  mounted() {
    this.fetchCategories()
  }
}
</script>
<style scoped>
  /* Add custom styles for your dashboard here */
  .dashboard {
    min-height: 100vh;
    padding: 20px;
    background-color: #E5E4E2;
  }
  .header-text {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: bold;
    color: white;
  }
  .card {
  min-height: 260px;
  max-height: 260px;
  background-color: #7fc9ff;
  }
  .register-expense {
    box-shadow: 5px 5px 8px;
    border-radius: 6px;
  }
  .register-expense:hover {
    box-shadow: 8px 8px 10px;
  }
  .add-expense-button-container {
  text-align: right;
  margin-top: 10px;
  }
  .add-expense-button {
    background-color: #50C878;
  }
  .add-expense-button:hover {
    box-shadow: 2px 2px 4px;
  }
  .category-popup-button {
    background-color: white;
    margin-left: 5px;
  }
  .category-popup-button:hover {
    box-shadow: 2px 2px 4px;
  }
  .my-account {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-shadow: 5px 5px 8px;
    border-radius: 6px;
    cursor: pointer;
  }
  .my-account:hover {
    text-decoration: underline;
    text-decoration-color: white;
    box-shadow: 8px 8px 10px;
  }
  .category:hover {
    cursor: pointer;
  }
  .manage-budgets {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    box-shadow: 5px 5px 8px;
    border-radius: 6px;
    cursor: pointer;
  }
  .manage-budgets:hover {
    text-decoration: underline;
    text-decoration-color: white;
    box-shadow: 8px 8px 10px;
  }
  .dropdown-button-container {
    display: flex;
    align-items: center;
  }
  .popup {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #7fc9ff; /* Adjust the background color and opacity as needed */
    display: flex;
    justify-content: center;
    z-index: 1000;
    align-items: center;
    padding-left: 10%;
    padding-right: 10%;
  }
  .add-category-button {
    background-color: #50C878;
    margin-right: 10px;
    margin-top: 5px;
  }
  .cancel-button {
    background-color: #dc3545;
    margin-top: 5px;
  }
  </style>
