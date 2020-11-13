
<script>
import { Bar } from 'vue-chartjs'

export default {
extends: Bar,
data: () => ({
    chartdata: {
      labels: ['Web', 'Program', 'Networking', 'DB', 'Mobile', 'Front', 'Backend', 'English'],
      datasets: [
        {
          label: 'Aptitudes',
          backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(48, 114, 17, 0.2)',
                'rgba(114, 73, 26, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(48, 114, 17, 1)',
                'rgba(114, 73, 26, 1)',
            ],
            borderWidth: 1, 
          data: [85, 90, 80, 75, 85, 85, 90, 90, 100, 0],
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>

<style>

</style>