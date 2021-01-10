<template>
  <div class="bots">
    <h2>Bots</h2>
    <div class="table">
      <b-table striped hover bordered :items="bots" :fields="fields">
        <template #cell(actions)="row">
          <b-button size="sm" variant="outline-primary" @click="deleteBot(row.item.name)">
            <b-icon-trash />
          </b-button>
        </template>
      </b-table>
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
      },
      {
        key: 'actions',
        label: 'Actions',
        sortable: false,
        tdClass: 'actions-col'
      }
    ];

    async function getBots() {
      const response = await axios.get('http://localhost:4000/getAll');

      response.data.forEach(bot => {
        bots.value.push({
          name: bot.name,
          subreddit: bot.subreddit,
          fakeNews: bot.fakeNews,
          hateSpeech: bot.hateSpeech
        });
      });
    }

    function deleteBot(botName) {
      axios.delete('http://localhost:4000/deleteBot', {
        data: { name: botName }
      });

      bots.value.splice(bots.value.findIndex(bot => bot.name === botName), 1);
    }

    getBots();

    // Mock data
    // bots.value = [
    //   {
    //     name: 'Name 1',
    //     subreddit: 'Sub 1',
    //     fakeNews: true,
    //     hateSpeech: true
    //   },
    //   {
    //     name: 'Name 2',
    //     subreddit: 'Sub 2',
    //     fakeNews: false,
    //     hateSpeech: true
    //   },
    //   {
    //     name: 'Name 3',
    //     subreddit: 'Sub 3',
    //     fakeNews: false,
    //     hateSpeech: false
    //   }
    // ];

    return {
      bots,
      fields,
      deleteBot
    };
  }
}
</script>

<style>
.bots {
  display: flex;
  flex-direction: column;
  padding: 50px;
  align-items: center;
  justify-content: center;
}

.table {
  width: 1000px;
  margin-top: 20px;
}

.actions-col {
  width: 10%;
}
</style>