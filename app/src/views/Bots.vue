<template>
  <div class="bots">
    <h2>Bots</h2>
     <label class="refresh">
      <b-button variant="outline-primary" @click="getBots">Refresh</b-button>
    </label>
    <div class="table">
      <b-table striped hover bordered :items="bots" :fields="fields">
        <template #cell(actions)="row">
          <b-button size="sm" variant="outline-primary" @click="deleteBot(row.item.name)">
            <b-icon-trash />
          </b-button>
          <b-button v-b-modal.edit-modal size="sm" @click="handleModal(row.item)" variant="outline-primary" class="actionButton">
            <b-icon-pencil />
          </b-button>
        </template>
      </b-table>
    </div>
    <b-modal id="edit-modal" title="Edit Bot" @ok="editBot(modalName, newFields)" class="actionButton">
      <h5>Name: {{modalName}}</h5>
      <label>
        Subreddit: r/ 
        <input type="text" v-model="newFields.subreddit" class="input">
        (Previously: {{modalSub}})
      </label>
      <!-- <b-form-group class="checkbox">
        <b-form-checkbox v-model="newHateSpeech" class="check">
          Detect Hate Speech
        </b-form-checkbox>
        <b-form-checkbox v-model="newFakeNews" class="check">
          Detect Fake News
        </b-form-checkbox>
      </b-form-group> -->
    </b-modal>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Bots',
  setup() {
    const bots = ref([]);
    const modalInfo= ref([]);
    const modalSub = ref('');
    const modalName = ref('');
    const fields = ref([]);
    const newFields = ref([]);
    // const newFakeNews = ref(false);
    // const newHateSpeech = ref(false);

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
        thClass: 'actions-col',
        tdClass: 'actions-col'
      }
    ];

    async function getBots() {
      const response = await axios.get('http://localhost:4000/getAll');

      bots.value = [];
      response.data.forEach(bot => {
        bots.value.push({
          name: bot.name,
          subreddit: bot.subreddit,
          fakeNews: bot.fakeNews,
          hateSpeech: bot.hateSpeech
        });
      });

      if (bots.value.length === 0) {
        bots.value = [
          {
            name: 'No bots found',
            subreddit: 'N/A',
            fakeNews: true,
            hateSpeech: false
          }
        ];
      }
    }

    function deleteBot(botName) {
      axios.delete('http://localhost:4000/deleteBot', {
        data: { name: botName }
      });

      bots.value.splice(bots.value.findIndex(bot => bot.name === botName), 1);
    }

    function editBot(botName, newInfo) {
      var formData = {
        "name": botName,
        "newAttributes": {
          "subreddit": newInfo.subreddit,
          "hateSpeech": true,
          "fakeNews": false
        }
      }
      console.log(axios.put('http://localhost:4000/editBot', formData));
      // this.$forceUpdate();

            // {"name": "test1",
            // "newAttributes": {"fakeNews": "true",
            // "hateSpeech": "true",
            // "subreddit": "EDIT_TEST"}}
    }

    function handleModal(bot) {
      modalInfo.value = bot;
      modalName.value = modalInfo.value.name;
      modalSub.value = modalInfo.value.subreddit;
    }

    getBots();

    return {
      bots,
      modalSub,
      modalName,
      modalInfo,
      // newFakeNews,
      // newHateSpeech,
      fields,
      newFields,
      handleModal,
      getBots,
      deleteBot,
      editBot,
    };
  }
}
</script>

<style>
.bots h2 {
  font-weight: bold;
}

.bots {
  display: flex;
  flex-direction: column;
  padding: 50px;
  align-items: center;
  justify-content: center;
}

.table {
  width: 1000px;
  margin-top: 10px;
}

.actions-col {
  width: 10%;
}

.actionButton {
  margin: 4px;
}

.refresh {
  float: right;
  margin-right: 8px;
  margin-left: 1220px;
  margin-bottom: 0px;
}

.input {
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

</style>
