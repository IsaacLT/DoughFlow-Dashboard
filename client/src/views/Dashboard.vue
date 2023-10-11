<template>
  <div>
    <div class="dashboard">
      <Navbar id="navbar"/>
      <main>
        <div class="container mt-4">
          <div class="row">
            <!-- Register Expense Box -->
            <div class="col-md-4">
              <div class="expenseCard card">
                <div class="card-body register-expense">
                  <h5 class="header-text">Register Expense</h5>
                  <!-- Amount input -->
                  <div class="form-group">
                    <div class="input-box">
                    <input type="number" class="form-control" v-model="amount" placeholder="Amount" required>
                    </div>
                  </div>
                  <!-- Dropdown category selection -->
                  <div class="form-group">
                    <div class="dropdown-button-container">
                        <select class="form-control category" v-model="categoryId" required>
                        <option disabled value="">Category</option>
                        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.categoryName }}</option>
                      </select>
                      <button class="btn category-popup-button" @click="showPopup = true">+</button>
                      <Toast ref="toast" />
                    </div>
                  </div>
                  <!-- New category Popup -->
                  <div v-if="showPopup" class="popup">
                    <div class="form-group">
                      <input class="form-control category-input" v-model="categoryName" @keyup.enter="addCategory" placeholder="New category" />
                      <button class="btn add-category-button" @click="addCategory">Add</button>
                      <button class="btn exit-button" @click="showPopup = false">Exit</button>
                    </div>
                  </div>
                  <!-- Description input -->
                  <div class="form-group">
                    <div class="input-box">
                      <input type="text" class="form-control" v-model="description" placeholder="Description" required>
                    </div>
                  </div>
                  <!-- Add expense button -->
                  <div class="add-expense-button-container">
                    <button class="btn add-expense-button" @click="addExpense">Add</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Switch to budgets page -->
            <div class="col-md-4">
              <div class="budgetCard card clickable-box" @click="switchToBudgets">
                <div class="card-body text-center manage-budgets">
                  <h5 class="header-text">Manage Budgets</h5>
                </div>
              </div>
            </div>
            <!-- Switch to my account page -->
            <div class="col-md-4">
              <div class="card clickable-box" @click="switchToMyAccount">
                <div class="card-body text-center my-account">
                  <h5 class="header-text">My account</h5>
                </div>
              </div>
            </div>
          </div>
          <!-- Second Row -->
          <div class="row mt-4">
            <!-- Radial chart Box -->
            <div class="col-md-6">
              <div class="radialCard card">
                <div class="radialbar card-body">
                    <apexchart type="radialBar" :options="chartOptions" :series="[remainingAmountPercentage]"/>
                </div>
              </div>
            </div>
            <!-- Column chart Box -->
            <div class="col-md-6">
              <div class="barCard card">
                <div class="barChart card-body">
                  <h5 id="barchartHeader">Spent By Category</h5>
                  <div class="form-group">
                    <ColumnChart :categories="categories"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import ColumnChart from '../components/Columnchart.vue'
import Navbar from '@/components/Navbar'
import Toast from '@/components/Toast'
import Api from '@/Api.js'

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
  computed: {
    selectedBudget() {
      return this.$store.getters.getSelectedBudget
    },
    remainingAmount() {
      if (this.selectedBudget) {
        return this.selectedBudget.amount - this.totalExpenses
      }
      return 0
    },
    remainingAmountPercentage() {
      if (this.selectedBudget) {
        return (this.totalExpenses() / this.selectedBudget.amount) * 100
      }
      return 0
    },
    chartOptions() {
      return {
        chart: {
          type: 'radialBar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 0,
              size: '80%'
            },
            track: {
              background: '#fff',
              strokeWidth: '95%',
              margin: 0,
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
              }
            },
            dataLabels: {
              show: true,
              name: {
                offsetY: -10,
                show: true,
                color: '#FFFFFF',
                fontSize: '20px',
                fontFamily: 'Roboto slab'
              },
              value: {
                formatter: function (val) {
                  return parseInt(val) + '% Spent'
                },
                color: '#FFFFFF',
                fontSize: '30px',
                fontFamily: 'Roboto slab',
                show: true
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            type: 'horizontal',
            inverseColors: true,
            stops: [0, 100]
          }
        },
        stroke: {
          width: -10
        },
        labels: [this.selectedBudget ? (this.selectedBudget.name + ' Budget') : 'No Budget Selected']
      }
    }
  },
  components: {
    Navbar,
    ColumnChart,
    Toast
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
      const categoryId = this.categoryId
      const newExpense = {
        amount: parseFloat(this.amount),
        description: this.description,
        categoryId: this.categoryId,
        date: currentDate
      }
      console.log('Sending expense', newExpense)
      Api.post(`/categories/${categoryId}/expenses`, newExpense, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
          console.log('Expense added successfully', response.data)
          this.amount = null
          this.description = ''
          this.categoryId = ''
          this.fetchCategories()
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            this.$refs.toast.showToast('Error adding expense', 'Amount and/or Category is missing')
          }
        })
    },
    async fetchCategories() {
      if (!this.selectedBudget) {
        this.$refs.toast.showToast('No budget selected', 'Go to Manage Budgets to select/create a budget')
        return
      }
      const budgetId = this.selectedBudget._id
      Api.get(`/budgets/${budgetId}/categories`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
          this.categories = response.data.categories
        })
        .catch(error => {
          console.error('Error fetching categories', error)
        })
    },
    async addCategory() {
      if (!this.selectedBudget) {
        console.error('No budget selected')
        return
      }
      const budgetId = this.selectedBudget._id
      const newCategory = {
        categoryName: this.categoryName
      }
      Api.post(`/budgets/${budgetId}/categories`, newCategory, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
          console.log('Category added successfully', response.data)
          this.categoryName = ''
          this.fetchCategories()
        })
        .catch(error => {
          console.error('Error adding category', error)
        })
    },
    totalExpenses() {
      return this.categories.reduce((sum, category) => sum + category.totalAmount, 0)
    }
  },
  mounted() {
    this.fetchCategories()
  }
}
</script>
<style scoped>
  #navbar {
    padding-bottom: 20px;
  }
  .row {
    display: flex;
    align-items: stretch;
  }
  .card {
    box-shadow: 5px 5px 8px;
    background-color: #7fc9ff;
  }
  .register-expense {
    padding-top: 8px;
  }
  .radialCard {
    padding: 0px;
    align-items: center;
    max-height: 260px;
  }
  .barCard {
    align-items: center;
    max-height: 260px;
  }
  .radialbar {
    padding-bottom: 0px;
  }
  .barChart {
    padding-bottom: 0px;
  }
  #barchartHeader {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: bold;
    color: white;
    padding-top: 8px;
    padding-bottom: 0px;
  }
  .dashboard {
    min-height: 100vh;
    background-color: #E5E4E2;
  }
  .header-text {
    font-weight: bold;
    color: white;
  }
  .saved {
    min-height: 260px;
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
    min-height: 260px;
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
    min-height: 260px;
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
    background-color: #7fc9ff;
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
  .add-category-button:hover {
    box-shadow: 2px 2px 4px;
  }
  .exit-button {
    background-color: #dc3545;
    margin-top: 5px;
  }
  .exit-button:hover {
    box-shadow: 2px 2px 4px;
  }
  @media (max-width: 768px) {
  .budgetCard {
    margin-bottom: 20px;
  }
  .expenseCard {
    margin-bottom: 20px;
  }
  .radialCard {
    margin-bottom: 20px;
  }
  #barchartHeader {
    padding: 8px;
  }
}
</style>
