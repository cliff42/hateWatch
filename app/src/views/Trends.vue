<template>
  <div class="trends">
    <h1>Trends</h1>
      <TrendChart class="chart"
      :interactive="true"
      :datasets="data"
      :grid="{
        horizontalLines: true
      }"
      :labels='{
        xLabels: xLabels,
        yLabels: 10
      }'
      :min="0">
    </TrendChart>
    <h5>Date</h5>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Trends',
  setup() {
    const data = ref([]);
    const xLabels = ref([]);
    // get last 30 days

    function getLastDays() {
      const dates = [];
      let date = new Date();

      for (let i=0; i < 30; ++i) {
        dates.push((date.getMonth()+1) + '-' + date.getDate());
        date.setDate(date.getDate() - 1); 
      }
      xLabels.value = dates.reverse();
    }

    async function getTrends() {
      const response = await axios.get('http://localhost:4000/timeSeriesStatic');

      let i = 0;
      for (let subreddit in response.data) {
        data.value.push({
          data: response.data[subreddit],
          smooth: true,
          className: 'line-class-' + i
        });
        ++i;
      }
    }

    getTrends();
    getLastDays();

    return {
      data,
      xLabels
    };
  }
}
</script>

<style>
.trends h2 {
  font-weight: bold;
}

.trends {
  display: flex;
  padding: 50px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.chart {
  height: 500px;
}

.line-class-0 .stroke {
  stroke: #f69119;
  stroke-width: 2;
}

.line-class-1 .stroke {
  stroke: #7fdfd4;
  stroke-width: 2;
}

.line-class-2 .stroke {
  stroke: #fbe1b6;
  stroke-width: 2;
}

.y-axis {
  display: flex;
  vertical-align: text-top;
}
</style>
