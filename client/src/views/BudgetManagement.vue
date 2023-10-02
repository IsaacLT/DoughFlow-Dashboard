<template>
  <div class="everything">
    <Navbar id="navBar"/>

    <div class="budget-management container-fluid">
      <div class="row">

        <!-- Left Menu: List of Budgets -->
        <div class="left-menu col-md-3">
    <h2 id="headerText" class="white-text">Budgets</h2>
    <ul class="list-unstyled">
        <li v-for="budget in budgets" :key="budget._id">
            <div class="budget-box p-2 mb-3" @click.stop="handleBudgetClick(budget._id)">
                <div>{{ budget.name }} - ${{ budget.amount }}</div>
                <button class="btn btn-info btn-sm ml-2" @click.stop="selectBudget(budget)">Select Budget</button>
                <button class="btn btn-danger btn-sm ml-2" @click.stop="deleteBudget(budget._id)">Delete</button>
            </div>
        </li>
    </ul>
    <button @click="deleteAllBudgets" class="delete-all-button btn btn-danger btn-lg btn-block">Delete All Budgets</button>
</div>

        <div class="right-content col-md-9">

          <!-- Right Section: Create Budget Form -->
          <div class="right-section mb-4">
            <h2 id="headerText" class="white-text">Create New Budget</h2>
            <form @submit.prevent="createBudget" class="form-inline">
              <div class="create-budget-fields">
              <input v-model="newBudget.name" placeholder="Budget Name" required class="form-control mr-2" maxlength="10">
              <input v-model.number="newBudget.amount" placeholder="Amount" required class="form-control mr-2" maxlength="8">
              <button type="submit" class="btn btn-primary">Add Budget</button>
            </div>
            </form>
          </div>

          <div class="category-section" v-if="selectedBudget">
            <div v-if="categories && categories.length">
              <h2 class="white-text">Categories for {{ selectedBudget.name }}</h2>
              <ul class="list-unstyled">
                <li v-for="category in categories" :key="category._id" class="p-2 mb-3 border rounded">
                  <div class="category-container">
                    <div class="category-box">
                      <div class="category-name">
                        <strong>{{ category.categoryName }}</strong>
                      </div>
                    <div>Total amount spent: {{ sumExpenses(category.expenses) }}kr</div>
                    <ul class="list-unstyled">
                      <li v-for="expense in category.expenses" :key="expense._id" class="mt-2">
                        {{ expense.description }}: {{ expense.amount }}kr
                        <div>{{ formatDate(expense.date) }}</div>
                      </li>
                    </ul>
                  </div>
                  <button class="btn btn-danger btn-sm ml-2" @click.stop="deleteCategory(category._id)">Delete Category</button>
                </div>
                </li>
              </ul>
            </div>
            <div v-else>
              <h2 class="white-text">No categories for {{ selectedBudget.name }}</h2>
            </div>
          </div>
        </div>

      </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import Navbar from '../components/Navbar.vue'

export default {
  name: 'BudgetManagement',
  data() {
    return {
      newBudget: {
        name: '',
        amount: 0
      },
      budgets: [],
      selectedBudget: null,
      categories: [],
      expenses: [],
      URL: 'http://localhost:3000/api/v1'
    }
  },
  components: {
    Navbar
  },
  mounted() {
    axios.get(`${this.URL}/budgets`)
      .then(response => {
        if (Array.isArray(response.data)) {
          this.budgets = response.data
        } else {
          this.budgets = [] // If the API doesn't return an array, initialize as empty array
        }
      })
      .catch(error => {
        console.error('Error fetching budgets:', error)
      })
  },
  methods: {

    async createBudget() {
      try {
        const response = await fetch(`${this.URL}/budgets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newBudget)
        })
        const data = await response.json()
        if (data.error) {
          alert(data.error)
        } else {
          this.budgets.push(data)
          // Clear the input form
          this.newBudget = { name: '', amount: 0 }
        }
      } catch (error) {
        console.error('Error creating budget:', error)
      }
    },

    selectBudget(budget) {
      this.selectedBudget = budget
      alert(`${this.selectedBudget.name} is now set as your budget.`)
    },

    async fetchCategoriesForBudget(budgetId) {
      const response = await fetch(`${this.URL}/budgets/${budgetId}/categories`)
      if (!response.ok) {
        throw new Error('Error fetching categories')
      }
      return response.json()
    },

    async fetchExpensesForCategory(categoryId) {
      const response = await fetch(`${this.URL}/categories/${categoryId}/expenses`)
      if (!response.ok) {
        throw new Error('Error fetching expenses for category')
      }
      return response.json()
    },

    async handleBudgetClick(budgetId) {
      this.categories = []
      try {
        const budget = this.budgets.find(b => b._id === budgetId)
        this.selectedBudget = budget

        const categoryData = await this.fetchCategoriesForBudget(budgetId)
        this.categories = await Promise.all(categoryData.categories.map(async category => {
          const expensesData = await this.fetchExpensesForCategory(category._id)
          category.expenses = expensesData.expenses || []
          return category
        }))
      } catch (error) {
        console.error('Error:', error.message)
      }
    },

    async deleteBudget(id) {
      const confirmed = window.confirm('Are you sure you want to delete this budget? This action cannot be undone!')
      if (!confirmed) {
        return
      }
      try {
        const response = await fetch(`${this.URL}/budgets/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          // Remove the deleted budget from the list
          this.budgets = this.budgets.filter(budget => budget._id !== id)
        } else {
          const data = await response.json()
          alert(data.error)
        }
      } catch (error) {
        console.error('Error deleting budget:', error)
      }
    },
    async deleteAllBudgets() {
      const confirmed = window.confirm('Are you sure you want to delete all of your budgets? This step is irrevocable!')
      if (!confirmed) {
        return
      }
      try {
        const response = await fetch(`${this.URL}/budgets/`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          const data = await response.json()
          console.error('Error deleting all budgets:', data.error)
          alert(data.error)
          return
        }
        this.budgets = [] // Clear all budgets
        this.selectedBudget = null // Clear selected budget
        this.categories = [] // Clear categories
      } catch (error) {
        console.error('Error deleting all budgets:', error)
      }
    },

    async deleteCategory(categoryId) {
      const confirmed = window.confirm('Are you sure you want to delete this category? This action cannot be undone!')
      if (!confirmed) {
        return
      }

      try {
        const response = await fetch(`${this.URL}/categories/${categoryId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          // Remove the deleted category from the categories list
          this.categories = this.categories.filter(category => category._id !== categoryId)
        } else {
          const data = await response.json()
          alert(data.error)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    },

    async fetchExpensesByCategory(categoryId) {
      try {
        const response = await axios.get(`${this.URL}/categories/${categoryId}/expenses`)
        if (response.data && response.data.expenses && response.data.expenses.length > 0) {
          this.expenses = response.data.expenses
        } else {
          console.log('No expenses found for this category')
          this.expenses = []
        }
      } catch (error) {
        console.error('Error fetching expenses by category:', error)
      }
    },
    sumExpenses(expenses) {
      return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2)
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    }

  }
}
</script>

<style scoped>
.budget-management {
  display: flex;
  flex-direction: column;;
  align-items: stretch;
  height: 100vh;
  background: #7fc9ff;
}
.budget-management .row{
  flex-grow: 1;
  display: flex;
  align-items: stretch;
}
.budget-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.budget-info {
  margin-bottom: 5px;
}
.budget-actions {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
.left-menu {
  display: flex;
  flex-direction: column;
  /*height: 100%;*/
  position: relative;
  flex-shrink: 1;
  justify-content: space;
  min-width: 20px;
  background:#1f8cdb;
}

.left-menu li {
  margin-bottom: 10px;
}
.left-menu ul li:last-child {
    margin-bottom: 20px;
}
.left-menu ul {
  min-height: calc(100%-100px);
}

.right-section {
  flex: 3;
  flex-wrap: nowrap;
}

.right-content {
  display: flex;
  flex: 2;
  flex-direction: column;
  flex-wrap: nowrap;
  background: #7fc9ff;
}
.budget-box {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #42bbf7;
  background: #ffffff;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57acbb;
  }
}

/* Remove bullet point dots from list*/
.left-menu ul {
  list-style-type: none;
  /*padding-left: 0;*/
}

.category-section {
  flex: 2;
  flex-direction: column;
  padding-top: 30px;
  padding-left: 20px;
  /*border-left: 1px solid #b41a1a;*/
  list-style-type: none;
}
.category-section li {
  padding: 5px 10px;
  border: 1px solid #42bbf7;
  background: #ffffff;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e6f7ff;
  }
}
.category-section ul {
  list-style-type: none;
}

.category-box {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #ffffff;
    margin-right: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
    max-height: 200px;
    overflow-y: auto;

    &:hover {
        background-color: #53b1c1;
    }
}
.category-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
}
.delete-category-button {
  margin-top: 10px;
}
.delete-all-button {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 180px;
    max-height: 50px;
    margin-top: 10%;
    font-size: 15px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #b71a1a;
    }
}
.create-budget-fields {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
}
.form-control, .btn-primary {
    margin: 5px;
}
.form-control {
  min-width: 150px;
}
.white-text {
  color:#ffffff;
}
.category-name {
  font-size: 24px;
}
#navBar {
  align-items: flex-start;
}
#headerText {
  margin-top: 15px;
}
</style>
