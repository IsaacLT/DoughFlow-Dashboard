<template>
  <div class="budget-management">

    <!-- Left Menu: List of Budgets -->
    <div class="left-menu">
      <h2>Budgets</h2>
      <ul>
        <li v-for="budget in budgets" :key="budget._id">
          <!-- Budget box: encloses both name and amount -->
          <div class="budget-box" @click.stop="handleBudgetClick(budget._id)">
            {{ budget.name }} - ${{ budget.amount }}
            <button class="delete-button" @click.stop="deleteBudget(budget._id)">Delete</button>
          </div>
        </li>
      </ul>
    </div>

  <div class="Right-content">
    <!-- Right Section: Create Budget Form -->
    <div class="right-section">
      <h2>Create New Budget</h2>
      <form @submit.prevent="createBudget">
        <input v-model="newBudget.name" placeholder="Budget Name" required>
        <input v-model.number="newBudget.amount" placeholder="Amount" required>
        <button type="submit">Add Budget</button>
      </form>
    </div>

    <div class="category-section" v-if="selectedBudget">
    <div v-if="categories && categories.length">
        <h2>Categories for {{ selectedBudget.name }}</h2>
        <ul>
    <li v-for="category in categories" :key="category._id">
        <div class="category-box">
            <strong>{{ category.categoryName }}</strong>
            <!-- Display the total amount spent for this category-->
            <div>Total amount spent: {{ sumExpenses(category.expenses) }}kr</div>

            <!-- Display the expenses for this category -->
            <ul>
                <li v-for="expense in category.expenses" :key="expense._id">
                    {{ expense.description }}: {{ expense.amount }}kr
                    <div>{{ formatDate(expense.date) }}</div>
                </li>
            </ul>
        </div>
    </li>
</ul>

    </div>
    <div v-else>
        <h2>No categories for {{ selectedBudget.name }}</h2>
    </div>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios'

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
      expenses: []
    }
  },
  mounted() {
    axios.get('http://localhost:3000/api/v1/budgets')
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
        const response = await fetch('http://localhost:3000/api/v1/budgets', {
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
    async handleBudgetClick(budgetId) {
      this.categories = []
      try {
        const budget = this.budgets.find(b => b._id === budgetId)
        this.selectedBudget = budget

        const response = await fetch(`http://localhost:3000/api/v1/budgets/${budgetId}/categories`)

        if (!response.ok) {
          const data = await response.json()
          console.error('Error fetching categories:', data.error)
          return
        }

        const responseData = await response.json()
        console.log('Fetched Categories:', responseData)
        // Update the local categories array with fetched data
        this.categories = await Promise.all(
          responseData.categories.map(async category => {
            const expensesResponse = await fetch(`http://localhost:3000/api/v1/categories/${category._id}/expenses`)
            const expensesData = await expensesResponse.json()
            category.expenses = (expensesData && expensesData.expenses) || []
            return category
          })
        )

        this.$forceUpdate()
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    async deleteBudget(id) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/budgets/${id}`, {
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
    async fetchExpensesByCategory(categoryId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/categories/${categoryId}/expenses`)
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
  flex-direction: row;
  align-items: start;
}

.left-menu {
  flex-shrink: 1;
  min-width: 200px;
  border-right: 1px solid #ccc;
  padding-right: 10px;
  margin-right: 10px;
}

.left-menu li {
  margin-bottom: 10px;
}

.right-section {
  flex: 3;
}

.right-content {
  flex: 2;
  flex-direction: column;
}
.budget-box {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #42bbf7;
  margin-right: 10px; /* To give space between the box and the delete button */
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;

  /* Optional: add hover effect for better UX */
  &:hover {
    background-color: #53b1c1;
  }
}

/* Remove bullet point from list items */
.left-menu ul {
  list-style-type: none;
  /*padding-left: 0;*/
}

.category-section {
  flex: 2;
  flex-direction: column;
  padding-top: 30px;
  padding-left: 20px;
  border-left: 1px solid #ccc;
  list-style-type: none;
}
.category-section li {
  padding: 5px 10px;
  border: 1px solid #42bbf7;
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
    border: 1px solid #42bbf7;
    margin-right: 10px; /* To give space between boxes */
    margin-bottom: 10px; /* To give space between rows of boxes */
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
        background-color: #53b1c1;
    }
}

</style>
