<template>
    <div class="dashboard">
      <!-- Header with your logo -->
      <!-- (comment out image)
    <header>
        <img src="@/assets/logo.png" alt="Logo Here" />
      </header>
        -->
      <!-- Main content -->
      <main>
        <div class="container mt-4">
          <div class="row">
            <!-- Box 1 -->
            <div class="col-md-4">
              <div class="card">
                <div class="card-body">
                  <!-- Title-->
                  <h5>Register Expense</h5>
                  <div class="form-group">
                    <div class="input-box">
                    <input type="number" class="form-control" v-model="amount" placeholder="Register Expense" required>
                    </div>
                  </div>
                  <!-- Dropdown selection-->
                  <div class="form-group">
                    <select class="form-control" v-model="category" required>
                      <option value="category1">Category 1</option>
                      <option value="category2">Category 2</option>
                      <option value="category3">Category 3</option>
                      <option value="category4">Category 4</option>
                    </select>
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
              <div class="card">
                <div class="card-body">
                  Manage budgets
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
              <div class="card">
                <div class="card-body">
                  My account
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
</template>
<script>
export default {
  name: 'Dashboard'
}
</script>
<style scoped>
  /* Add custom styles for your dashboard here */
  .dashboard {
    min-height: 100vh;
    padding: 20px;
  }
  .card {
  min-height: 200px;
  }
  </style>
  This Vue component creates a simple grid layout with six boxes using Bootstrap classes. Each box is represented as a Bootstrap card with a placeholder "Box X" text. You can replace the content of each box with your actual content and functionality as needed.
  Please note that this is a basic layout, and you can customize the styles, content, and functionality of each box to match your project's requirements and design.
