<template>
  <div class="bots">
    <h2>Bots</h2>
    <div class="table">
      <b-table striped hover bordered :items="bots" :fields="fields"></b-table>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Bots',
  setup() {
    const bots = ref([]);
    const fields = ref([]);

    fields.value = [
      {
        key: 'name',
        label: 'Bot name',
        sortable: true
      },
      {
        key: 'subreddit',
        sortable: true
      }
    ];

    async function getBots() {
      const response = await axios.get('localhost:4000/getAll');

      response.forEach(bot => {
        bots.value.push({
          name: bot.name,
          subreddit: bot.subreddit,
          fakeNews: bot.fakeNews,
          hateSpeech: bot.hateSpeech
        });
      });
    }

    // getBots();

    bots.value = [
      {
        name: 'Name 1',
        subreddit: 'Sub 1',
        fakeNews: true,
        hateSpeech: true
      },
      {
        name: 'Name 2',
        subreddit: 'Sub 2',
        fakeNews: false,
        hateSpeech: true
      },
      {
        name: 'Name 3',
        subreddit: 'Sub 3',
        fakeNews: false,
        hateSpeech: false
      }
    ];

    return {
      bots,
      fields
    };
  }
}
</script>

<style scoped>
.bots {
  display: flex;
  flex-direction: column;
  padding: 50px;
  align-items: center;
  justify-content: center;
}

.table {
  width: 1000px;
  margin: 20px;
}
</style>