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
                    <select class="form-control" v-model="categoryId" required>
                      <option value="category1">Category 1</option>
                      <option value="category2">Category 2</option>
                      <option value="category3">Category 3</option>
                      <option value="category4">Category 4</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <div class="input-box">
                      <input type="text" class="form-control" v-model="description" placeholder="Description" required>
                    </div>
                  </div>
                  <!-- Button in the bottom right corner -->
                  <div class="button-container">
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
      categoryId: ''
    }
  },
  methods: {
    switchToBudgets() {
      this.$router.push('/manage-budgets')
    },
    switchToMyAccount() {
      this.$router.push('/my-account')
    },
    async addExpense() {
      const currentDate = new Date().toISOString()
      const newExpense = {
        amount: this.amount,
        description: this.description,
        categoryId: this.categoryId,
        date: currentDate
      }
      axios
        .post('http://localhost:3000/expenses', newExpense)
        .then(response => {
          console.log('Expense added successfully', response.data)
          this.amount = ''
          this.description = ''
          this.categoryId = ''
        })
        .catch(error => {
          console.error('Error adding expense', error)
        })
    }
  }
}
</script>
<style scoped>
  /* Add custom styles for your dashboard here */
  .dashboard {
    min-height: 100vh;
    padding: 20px;
  }
  .header-text {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: bold;
    color: white;
  }
  .card {
  min-height: 260px;
  max-height: 260px;
  background-color: #7fc9ff;;
  }
  .register-expense {
    box-shadow: 5px 5px 8px;
    border-radius: 6px;
  }
  .register-expense:hover {
    box-shadow: 8px 8px 10px;
  }
  .button-container {
  text-align: right;
  margin-top: 10px;
  }
  .add-expense-button {
    background-color: #50C878;
  }
  .add-expense-button:hover {
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
  </style>
