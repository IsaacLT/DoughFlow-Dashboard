<template>
    <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
  </template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  components: {
    apexchart: VueApexCharts
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'columnchart'
        },
        xaxis: {
          categories: ['Food', 'Utilities', 'Rent', 'Leisure']
        }
      },
      series: [
        {
          name: 'Expenses',
          data: ['20%', '25%', '30%', '22%']
        }
      ]
    }
  },
  methods: {
    async fetchData() {
      // Fetch data from your MongoDB database
      // Populate the xaxis.categories with category names
      // Populate the series[0].data with total expense amounts for each category
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>
