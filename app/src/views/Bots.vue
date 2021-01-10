<template>
  <div class="bots">
    <h2>Bots</h2>
    <div class="table">
      <b-table striped hover bordered :items="bots" :fields="fields">
        <template #cell(actions)="row">
          <!-- delete button -->
          <b-button size="sm" variant="outline-primary" @click="deleteBot(row.item.name)">
            <b-icon-trash />
          </b-button>
          <!-- update button -->
          <b-button v-b-modal.edit-modal size="sm" variant="outline-primary" class="actionButton">
            <b-icon-pencil />
          </b-button>
          <b-modal id="edit-modal" title="Edit Bot" @ok="editBot(row.item.name, newFields)" class="actionButton">
            <h5>Name: {{row.item.name}}</h5>
            <label>
              Subreddit: r/ 
              <input type="text" v-model="newFields.subreddit" class="input">
              (Previously: {{row.item.subreddit}})
            </label>
            <b-form-group class="checkbox">
              <b-form-checkbox v-model="newFields.hateSpeech" class="check">
                Detect Hate Speech
              </b-form-checkbox>
              <b-form-checkbox v-model="newFields.fakeNews" class="check">
                Detect Fake News
              </b-form-checkbox>
            </b-form-group>
          </b-modal>
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
    const bots = ref([{name:"bot1", subreddit:"sub1", hateSpeech:"true"}]);
    const fields = ref([]);
    const newFields = ref([]);

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

    function editBot(botName, newInfo) {
      const fullNewInfo = {
        "name": botName,
        "newAttributes": {"fakeNews": newInfo.fakeNew, "hateSpeech": newInfo.hateSpeech,},
        "subreddit": newFields.subreddit};
      console.log('EDIT CALLED');
      console.log(newInfo.hateSpeech);
      console.log(newInfo.fakeNews);
      console.log(newInfo.subreddit);
      axios.put('http://localhost:4000/editBot', {
        data: { name: botName, newAttributes: newInfo}
            // {"name": "test1",
            // "newAttributes": {"fakeNews": "true",
            // "hateSpeech": "true",
            // "subreddit": "EDIT_TEST"}}
      });
      getBots();
    }

    getBots();

    return {
      bots,
      fields,
      newFields,
      deleteBot,
      editBot,
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

.actionButton {
  margin: 4px;
}

.input {
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.modal-text {

}
</style>