<template>
  <BaseLayout>
    <div class="chart-page container py-5 text-light">

      <!-- 1) Releases per year -->
      <div class="mb-5">
        <h2 class="mb-4 text-center">{{ $t('chart.title') }}</h2>
        <div class="chart-wrapper position-relative">
          <!-- Y-axis label -->
          <div class="axis-label y-axis">{{ yLabels.releases }}</div>
          <!-- Canvas -->
          <canvas v-show="!loading" ref="yearCanvas"></canvas>
          <!-- X-axis label -->
          <div class="axis-label x-axis">{{ xLabels.releases }}</div>
        </div>
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-light" role="status"></div>
        </div>
      </div>

      <!-- 2) Games added to wishlist -->
      <div class="mb-5">
        <h2 class="mb-4 text-center">{{ $t('chart.wishlistTitle') }}</h2>
        <div class="chart-wrapper position-relative">
          <div class="axis-label y-axis">{{ yLabels.wish }}</div>
          <canvas v-show="!loading" ref="wishCanvas"></canvas>
          <div class="axis-label x-axis">{{ xLabels.wish }}</div>
        </div>
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-light" role="status"></div>
        </div>
      </div>

      <!-- 3) Games completed per game -->
      <div>
        <h2 class="mb-4 text-center">{{ $t('chart.completionsTitle') }}</h2>
        <div class="chart-wrapper position-relative">
          <div class="axis-label y-axis">{{ yLabels.comp }}</div>
          <canvas v-show="!loading" ref="compCanvas"></canvas>
          <div class="axis-label x-axis">{{ xLabels.comp }}</div>
        </div>
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border text-light" role="status"></div>
        </div>
      </div>

    </div>
  </BaseLayout>
</template>

<script>
import { ref, watch } from 'vue';
import { useI18n }    from 'vue-i18n';
import BaseLayout     from './BaseLayout.vue';
import {
  Chart, Title, BarController,
  Tooltip, Legend, BarElement,
  CategoryScale, LinearScale
} from 'chart.js';
import api from '@/api';

Chart.register(
  Title, Tooltip, Legend,
  BarElement, CategoryScale,
  LinearScale, BarController
);

export default {
  name: 'GamesChart',
  components: { BaseLayout },

  setup() {
    const { t, locale } = useI18n({ useScope: 'global' });

    const xLabels = {
      releases: ref(t('chart.axis.year')),
      wish:     ref(t('chart.axis.game')),
      comp:     ref(t('chart.axis.game')),
    };
    const yLabels = {
      releases: ref(t('chart.axis.count')),
      wish:     ref(t('chart.axis.count')),
      comp:     ref(t('chart.axis.count')),
    };

    watch(locale, () => {
      xLabels.releases.value = t('chart.axis.year');
      yLabels.releases.value = t('chart.axis.count');
      xLabels.wish.value     = t('chart.axis.game');
      yLabels.wish.value     = t('chart.axis.count');
      xLabels.comp.value     = t('chart.axis.game');
      yLabels.comp.value     = t('chart.axis.count');
    });

    return { xLabels, yLabels, t };
  },

  data() {
    return {
      loading:    true,
      yearChart:  null,
      wishChart:  null,
      compChart:  null,
      yearData:   { labels: [], datasets: [] },
      wishData:   { labels: [], datasets: [] },
      compData:   { labels: [], datasets: [] }
    };
  },

  async mounted() {
    // Load all data
    await Promise.all([
      this.loadReleases(),
      this.loadWishlistStats(),
      this.loadCompletionStats()
    ]);
    this.loading = false;

    // Build charts without internal axis titles
    this.yearChart = this.buildChart(this.$refs.yearCanvas, this.yearData);
    this.wishChart = this.buildChart(
      this.$refs.wishCanvas,
      this.wishData,
      { maxBarThickness: 40 },
      { categoryPercentage: 0.4, barPercentage: 0.6 }
    );
    this.compChart = this.buildChart(
      this.$refs.compCanvas,
      this.compData,
      { maxBarThickness: 40 },
      { categoryPercentage: 0.4, barPercentage: 0.6 }
    );
  },

  beforeUnmount() {
    [ this.yearChart, this.wishChart, this.compChart ].forEach(c => c?.destroy());
  },

  methods: {
    buildChart(canvas, data, datasetOpts = {}, scaleOpts = {}) {
      const ctx = canvas.getContext('2d');
      const labels   = Array.from(data.labels);
      const datasets = data.datasets.map(ds => ({
        data:            Array.from(ds.data),
        backgroundColor: ds.backgroundColor,
        borderColor:     ds.borderColor,
        borderWidth:     ds.borderWidth,
        ...datasetOpts
      }));

      return new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets },
        options: {
          responsive: true,
          aspectRatio: 3,
          animation: false,
          plugins: {
            legend: { display: false },
            title:  { display: false }
          },
          scales: {
            x: {
              title: { display: false },
              ticks: { color: '#fff', font: { size: 12 } },
              categoryPercentage: scaleOpts.categoryPercentage ?? 0.8,
              barPercentage:      scaleOpts.barPercentage      ?? 0.9
            },
            y: {
              title:       { display: false },
              beginAtZero: true,
              ticks:       { color: '#fff', font: { size: 12 }, precision: 0 }
            }
          }
        }
      });
    },

    async loadReleases() {
      let games = [];
      try {
        const res = await api.get('/games/trending', { params: { size:1000, page:1 } });
        games = res.data;
      } catch (e) {
        console.error('Failed to load trending games:', e);
      }
      const counts = games.reduce((acc, g) => {
        if (!g.released) return acc;
        const yr = new Date(g.released).getFullYear();
        acc[yr] = (acc[yr]||0) + 1;
        return acc;
      }, {});
      const years = Object.keys(counts).map(Number).sort((a,b)=>a-b);
      this.yearData = {
        labels: years,
        datasets: [{
          data: years.map(y=>counts[y]),
          backgroundColor:'#e53935aa',
          borderColor:    '#e53935',
          borderWidth:    1
        }]
      };
    },

    async loadWishlistStats() {
      try {
        const res = await api.get('/stats/wishlist-by-game');
        this.wishData = {
          labels: res.data.map(s=>s.gameName),
          datasets: [{
            data: res.data.map(s=>s.count),
            backgroundColor:'#1976D2aa',
            borderColor:    '#1976D2',
            borderWidth:    1
          }]
        };
      } catch (e) {
        console.error('Failed to load wishlist stats:', e);
      }
    },

    async loadCompletionStats() {
      try {
        const res = await api.get('/stats/completed-by-game');
        this.compData = {
          labels: res.data.map(s=>s.gameName),
          datasets: [{
            data: res.data.map(s=>s.count),
            backgroundColor:'#43A047aa',
            borderColor:    '#43A047',
            borderWidth:    1
          }]
        };
      } catch (e) {
        console.error('Failed to load completion stats:', e);
      }
    }
  }
};
</script>

<style scoped>
.chart-page {
  min-height: 70vh;
}

/* container for each chart to position axis labels */
.chart-wrapper {
  position: relative;
}

/* Y-axis label, rotated */
.axis-label.y-axis {
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  transform-origin: center;
  color: #bbb;
  font-size: 0.9rem;
}

/* X-axis label, centered under canvas */
.axis-label.x-axis {
  text-align: center;
  margin-top: 0.5rem;
  color: #bbb;
  font-size: 0.9rem;
}

.chart-page canvas {
  display: block;
  width: 100%;
  height: auto;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
