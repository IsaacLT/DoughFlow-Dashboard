<template>
  <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  props: {
    categories: Array
  },
  components: {
    apexchart: VueApexCharts
  },
  computed: {
    categoryNames() {
      return this.categories.map(cat => cat.categoryName)
    },
    totalExpenses() {
      return this.categories.reduce((acc, curr) => acc + curr.totalAmount, 0)
    },
    categoryTotals() {
      return this.categories.map(category => category.totalAmount)
    },
    chartOptions() {
      let rotationAngle = 0
      if (this.categoryNames.length > 6) {
        rotationAngle = -45
      }
      return {
        chart: {
          id: 'columnchart',
          toolbar: {
            show: false
          }
        },
        xaxis: {
          categories: this.categoryNames,
          labels: {
            rotate: rotationAngle,
            formatter: (value) => {
              return value.length > 5 ? value.substr(0, 5) + '...' : value
            },
            style: {
              fontSize: this.xAxisFontSize,
              fontFamily: 'Roboto slab',
              fontWeight: 'bold',
              colors: '#FFFFFF'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Roboto slab',
              fontWeight: 'bold',
              colors: '#FFFFFF'
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
        name: '% of total spent',
        data: this.categoryTotals
      }]
    }
  }
}
</script>
