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
                <div>{{ budget.name }} - {{ budget.amount }} kr</div>
                <button class="btn btn-info btn-sm ml-2" @click.stop="selectBudget(budget); handleBudgetClick(budget._id)">Select Budget</button>
                <button class="btn btn-danger btn-sm ml-2" @click.stop="deleteBudget(budget)">Delete</button>
            </div>
        </li>
    </ul>
    <button @click="deleteAllBudgets" class="delete-all-button btn btn-danger btn-lg btn-block">Delete All Budgets</button>
</div>
        <!-- Right content -->
        <div class="right-content col-md-9">
          <!-- Right Section: Create Budget Form -->
          <div class="right-section mb-4">
            <h2 id="headerText" class="white-text">Create New Budget</h2>
            <form @submit.prevent="createBudget" class="form-inline">
              <div class="create-budget-fields">
              <input v-model="newBudget.name" placeholder="Budget Name" required class="form-control mr-2" maxlength="10">
              <input v-model.number="newBudget.amount" @input="checkPositiveBudget" placeholder="Amount" type="number" required class="form-control mr-2" maxlength="8">
              <button type="submit" class="btn btn-primary">Add Budget</button>
            </div>
            </form>
          </div>

          <!-- Category Section-->
          <div class="category-section" v-if="selectedBudget">
            <div v-if="categories && categories.length">
              <h2 class="white-text">Categories for {{ selectedBudget.name }}</h2>
              <ul class="list-unstyled">
                <li v-for="category in categories" :key="category._id" class="p-2 mb-3 border rounded">
                  <div class="category-container">
                    <div class="category-name">
                        <strong>{{ category.categoryName }}</strong>
                      </div>
                    <div>Total amount spent: {{ sumExpenses(category.expenses) }} kr</div>
                    <div class="category-box">

                    <ul class="list-unstyled">
                      <li v-for="expense in category.expenses" :key="expense._id" class="mt-2">
                        <div class="expense-container" @click="showUpdateButton(expense._id)">
                        {{ expense.description }}: {{ expense.amount }} kr
                        <div>{{ formatDate(expense.date) }}</div>

                        <button v-if="showUpdateButtonId === expense._id" class="btn btn-info btn-sm ml-2 t-1 b-2" @click.stop="toggleUpdateForm(expense._id)">Update Expense</button>
                        <div v-if="showUpdateForm === expense._id">

                        <input v-model="expenseAmount" @input="checkPositiveExpense" placeholder="Amount" @click.stop class="form-control">
                        <input v-model="expense.description" placeholder="Description" @click.stop class="form-control">
                        <input :value="formatDateForInput(expense.date)"  @input="expense.date = $event.target.value, checkPositive" type="date" placeholder="Date" @click.stop class="form-control">
                        <button class="save-expense-button btn btn-info btn-sm ml-2 t-1 b-2" @click="updateExpense(expense)">Save</button>
                        <button class="btn btn-danger btn-sm ml-2" @click.stop="deleteExpense(category, expense._id)">Delete Expense</button>
                      </div>
                      </div>
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
        <Toast ref="toast" />
      </div>
      </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import { mapGetters } from 'vuex'
import Toast from '../components/Toast.vue'
import Api from '@/Api.js'

export default {
  name: 'BudgetManagement',
  data() {
    return {
      expenseAmount: 0,
      newBudget: {
        name: '',
        amount: 0
      },
      budgets: [],
      selectedBudget: null,
      categories: [],
      expenses: [],
      URL: 'http://localhost:3000/api/v1',
      showUpdateForm: null,
      showUpdateButtonId: null
    }
  },

  components: {
    Navbar,
    Toast
  },
  computed: {
    ...mapGetters(['getSelectedBudget'])
  },
  mounted() {
    this.getBudgets()
  },
  methods: {
    // Fetches budgets belonging to the currently logged in user by its username
    async getBudgets() {
      const username = localStorage.getItem('username')
      Api.get(`/users/${username}/budgets`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
        .then(response => {
          this.budgets = response.data
        })
        .catch(error => {
          console.error('Error fetching categories', error)
        })
    },

    // Creates new budget and connects it to a user, then adds it to the list of budgets belonging to that user
    async createBudget() {
      const username = localStorage.getItem('username')
      try {
        const response = await fetch(`${this.URL}/users/${username}/budgets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token')
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

    // Updates which budget is currently selected when clicking the select budget button
    selectBudget(budget) {
      this.$store.dispatch('updateSelectedBudget', budget)
      const budgetName = `${budget.name}`
      this.$refs.toast.showToast('Budget Chosen', budgetName + ' is now set as your budget')
    },

    // Fetches list of category objects belonging to a specific budget
    async fetchCategoriesForBudget(budgetId) {
      const response = await fetch(`${this.URL}/budgets/${budgetId}/categories`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      if (!response.ok) {
        throw new Error('Error fetching categories')
      }
      return response.json()
    },

    // Fetches list of expense objects belonging to a specific category
    async fetchExpensesForCategory(categoryId) {
      const response = await fetch(`${this.URL}/categories/${categoryId}/expenses`, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } })
      if (!response.ok) {
        throw new Error('Error fetching expenses for category')
      }
      console.log(response.json)
      return response.json()
    },

    // Clears the current categories, identifies the selected budget by its ID, fetches its associated categories,
    // and then for each category, fetches and attaches its corresponding expenses
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

    // Utilizing hateoas links, fetches the current budget and removes it from the list of budgets belonging to the currently logged in user
    async deleteBudget(budget) {
      console.log('Budget data:', budget)

      // Check so that the budget object actually contains hateoas links
      if (!budget.links || !budget.links.delete) {
        alert('Delete action is not available for this budget.')
        return
      }

      const confirmed = window.confirm('Are you sure you want to delete this budget? This action cannot be undone!')
      if (!confirmed) {
        return
      }
      try {
        // Instead of using a hardcoded url, use the HATEOAS link that's part of the budget object to delet
        const response = await fetch(budget.links.delete.href, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })
        if (response.ok) {
          // Remove the deleted budget from the list
          this.budgets = this.budgets.filter(b => b._id !== budget._id)
        } else {
          const data = await response.json()
          alert(data.error)
        }
      } catch (error) {
        console.error('Error deleting budget:', error)
      }
    },

    // Delete all of the budgets for this user
    async deleteAllBudgets() {
      const confirmed = window.confirm('Are you sure you want to delete all of your budgets? This step is irrevocable!')
      if (!confirmed) {
        return
      }
      const username = localStorage.getItem('username')
      try {
        const response = await fetch(`${this.URL}/users/${username}/budgets/`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
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

    // Delete single category from category list for that budget
    async deleteCategory(categoryId) {
      const confirmed = window.confirm('Are you sure you want to delete this category? This action cannot be undone!')
      if (!confirmed) {
        return
      }

      try {
        const response = await fetch(`${this.URL}/categories/${categoryId}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
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

    // PUT update an expense
    async updateExpense(expenseToUpdate) {
      try {
        expenseToUpdate.amount = this.expenseAmount
        const updatedData = {
          amount: parseFloat(expenseToUpdate.amount),
          description: expenseToUpdate.description,
          date: new Date(expenseToUpdate.date).toISOString()
        }

        const response = await Api.put(`/expenses/${expenseToUpdate._id}`, updatedData, {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })

        if (response.status === 200) {
          console.log('After successful update:', this.showUpdateForm)
          this.$refs.toast.showToast('Expense Update', 'Expense updated successfully!')
          // Optionally update the local data or re-fetch the data
          this.showUpdateForm = false
          console.log('After setting to false:', this.showUpdateForm)
        } else {
          this.$refs.toast.showToast('Expense Error', 'Error updating the expense!')
        }
      } catch (error) {
        console.error('Error updating expense:', error)
      }
    },

    // Delete a single expense
    async deleteExpense(category, expenseId) {
      const confirmed = window.confirm('Are you sure you want to delete this expense? This action cannot be undone!')
      if (!confirmed) {
        return
      }

      try {
        const response = await fetch(`${this.URL}/expenses/${expenseId}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        })

        if (response.ok) {
          // Find the category within your categories array
          const categoryIndex = this.categories.indexOf(category)
          if (categoryIndex > -1) {
            // Update expenses for the found category
            this.categories[categoryIndex].expenses = this.categories[categoryIndex].expenses.filter(expense => expense._id !== expenseId)
          }
        } else {
          const data = await response.json()
          alert(data.error)
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    },

    // Show or hide the form for PUT updating expense
    toggleUpdateForm(expenseId) {
      if (this.showUpdateForm === expenseId) {
      // If the form the currently chosen expense is shown, hide it
        this.showUpdateForm = null
      } else {
      // Otherwise, show it
        this.showUpdateForm = expenseId
      }
    },

    // Show or hide the update button inside the expense box
    showUpdateButton(expenseId) {
      if (this.showUpdateButtonId === expenseId) {
        this.showUpdateButtonId = null
      } else {
        this.showUpdateButtonId = expenseId
        this.showUpdateForm = null // Ensure form is hidden when showing update button
      }
    },

    // Sums the total expenses (used to sum up expenses belonging to a specific category)
    sumExpenses(expenses) {
      return expenses.reduce((total, expense) => {
        const amount = parseFloat(expense.amount)
        return isNaN(amount) ? total : total + amount
      }, 0).toFixed(2)
    },

    // Changes the date attribute to work with the frontend date popup editor
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

    // Changes the date attribute back again to work with the backend date format
    formatDateForInput(dateString) {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    },

    // Check to make sure that the number is positive, used for input forms fields
    checkPositiveBudget() {
      if (this.newBudget.amount < 0) {
        this.$refs.toast.showToast('Invalid input', 'Please enter a positive number')
        this.newBudget.amount = 0
      }
    },
    checkPositiveExpense() {
      if (this.expenseAmount < 0) {
        this.$refs.toast.showToast('Invalid input', 'Please enter a positive number')
        this.expenseAmount = 0
      }
    }

  }
}

</script>

<style scoped>
.budget-management {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-top: 20px outset #E5E4E2;
  height: 93.55vh;
  background: #E5E4E2;
}
.budget-management .row{
  flex-grow: 1;
  display: flex;
  align-items: stretch;
}
.left-menu {
  display: flex;
  flex-direction: column;
  position: relative;
  border-right: 10px solid #E5E4E2;
  flex-shrink: 1;
  justify-content: space;
  min-width: 20px;
  padding: 5px;
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
  flex: 0.5;
  flex-wrap: nowrap;
}

@media (max-width: 764px) {
    .left-menu {
        border-right: none;
        border-bottom: 10px solid #E5E4E2;
    }
}
.right-content {
  display: flex;
  flex: 2;
  flex-direction: column;
  background: #7fc9ff;
}
.budget-box {
  display: inline-block;
  padding: 5px 10px;
  background: #ffffff;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #57acbb;
  }
}
.left-menu ul {
  list-style-type: none;
}
.category-section {
  flex: 2;
  flex-direction: column;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 4%;
  padding-right: 4%;
  list-style-type: none;
}
.category-section li {
  padding: 5px 10px;
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
    border: 1px solid #7fc9ff;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
    min-height: 50px;
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
.delete-all-button {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 180px;
    max-height: 50px;
    margin-top: 10%;
    font-size: 15px;
    background-color: "btn-danger";
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
  padding-top: 10px;
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
.save-expense-button {
  background-color: #50C878;
  border: none;
}
</style>
