<template>
  <BaseLayout>
    <div class="chart-page container py-5 text-light">
      <h2 class="mb-4 text-center">{{ $t('chart.title') }}</h2>

      <!-- Spinner while loading -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-light" role="status"></div>
      </div>

      <!-- Canvas always in DOM, just hidden until loading=false -->
      <div v-show="!loading">
        <canvas ref="canvas"></canvas>
        <p
          v-if="!loading && (!chartData || !chartData.labels.length)"
          class="text-center text-secondary mt-4"
        >
          {{ $t('chart.noData') }}
        </p>
      </div>
    </div>
  </BaseLayout>
</template>


<script>
import BaseLayout from './BaseLayout.vue'
import { useI18n } from 'vue-i18n';

import {
  Chart,
  Title,
  BarController,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import api from '@/api'

// Register Chart.js components
Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController)

export default {
  name: 'GamesChart',
  components: { BaseLayout },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const setLocale = (lang) => {
      locale.value = lang
    }
    return {
      currentLocale: locale,
      setLocale
    }
  },
  data() {
    return {
      loading: true,
      chartInstance: null,
      chartData: { labels: [], datasets: [] }
    }
  },
  async mounted() {
    // 1) fetch the games
    let games = []
    try {
      const res = await api.get('/games/trending', {
        params: { size: 299, page: 1 }
      })
      games = res.data
    } catch (e) {
      console.error('Failed to load games for chart:', e)
    }

    // 2) bucket by release year
    const counts = games.reduce((acc, g) => {
      if (!g.released) return acc
      const y = new Date(g.released).getFullYear()
      acc[y] = (acc[y] || 0) + 1
      return acc
    }, {})
    const years = Object.keys(counts)
      .map(v => +v)
      .sort((a, b) => a - b)
    const data = years.map(y => counts[y])

    // store dataset for the “no data” fallback
    this.chartData = {
      labels: years,
      datasets: [{
        label: 'Games Released',
        data,
        backgroundColor: '#e53935aa',
        borderColor: '#e53935',
        borderWidth: 1
      }]
    }

    // 3) flip loading to false, then create the chart in nextTick
    this.loading = false
    this.$nextTick(() => {
      // if there’s at least one label, draw the chart
      if (this.chartData.labels.length) {
        const ctx = this.$refs.canvas.getContext('2d')
        this.chartInstance = new Chart(ctx, {
          type: 'bar',
          data: this.chartData,
          options: {
            // ← disable all animations to avoid post-unmount errors
            animation: false,
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year',
                  color: '#fff',
                  font: { size: 18, weight: 'bold' }
                },
                ticks: {
                  color: '#fff',
                  font: { size: 14 }
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Number of Games',
                  color: '#fff',
                  font: { size: 18, weight: 'bold' }
                },
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: '#fff',
                  font: { size: 14 }
                }
              }
            },
            plugins: {
              legend: { display: false },
              title: { display: false }
            }
          }
        })
      }
    })
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
      this.chartInstance = null
    }
  }
}
</script>

<style scoped>
.chart-page {
  min-height: 70vh;
}

/* Make canvas full-width and taller */
.chart-page canvas {
  width: 100% !important;
  max-width: 1200px;
  height: 600px !important;
  margin: 0 auto;
  display: block;
}
</style>
