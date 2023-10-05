<template>
  <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  props: {
    categories: Array,
    expenses: Array
  },
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {}
  },
  computed: {
    categoryNames() {
      return this.categories.map(cat => cat.categoryName)
    },
    totalExpenses() {
      return this.expenses.reduce((acc, curr) => acc + curr.amount, 0)
    },
    aggregatedExpenses() {
      const sums = {}
      this.expenses.forEach(expense => {
        if (!sums[expense.categoryId]) {
          sums[expense.categoryId] = 0
        }
        sums[expense.categoryId] += expense.amount
      })
      return this.categories.map(category => sums[category._id] || 0)
    },
    chartOptions() {
      return {
        chart: {
          id: 'columnchart'
        },
        xaxis: {
          categories: this.categoryNames,
          labels: {
            style: {
              fontSize: '14px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '14px'
            }
          }
        },
        tooltip: {
          y: {
            formatter: (value) => {
              const percentage = ((value / this.totalExpenses) * 100).toFixed(2)
              return percentage + '%'
            }
          }
        }
      }
    },
    series() {
      return [{
        name: '% of total',
        data: this.aggregatedExpenses
      }]
    }
  },
  watch: {
    categories(newVal) {
      console.log('Categories updated:', newVal)
    },
    expenses(newVal) {
      console.log('Expenses updated:', newVal)
    }
  },
  mounted() {
    console.log('Received Categories:', this.categories)
    console.log('Received Expenses:', this.expenses)
  }
}
</script>
<style scoped>

</style>
