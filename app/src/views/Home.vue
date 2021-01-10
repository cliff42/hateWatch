<template>
  <div class="menu">
    <h2>Deploy Bot</h2>
    <b-form class="bot-form">
      <b-form-group>
        <b-form-input class="input" type="text" 
                      placeholder="Bot Name" v-model="name"/>
      </b-form-group>
      <b-form-group>
        <b-form-input class="input" type="text" 
                      placeholder="Subreddit" v-model="subreddit"/>
      </b-form-group>
      <!-- <b-form-group class="checkbox">
          <b-form-checkbox v-model="optionSpeech" class="check">
          Detect Hate Speech
          </b-form-checkbox>
          <b-form-checkbox v-model="optionNews" class="check">
          Detect Fake News
          </b-form-checkbox>
      </b-form-group> -->
      <label class="submit">
        <b-button variant="outline-primary" @click="onSubmit">Deploy</b-button>
      </label>
      <h5>{{message}}</h5>
    </b-form>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Home',
  setup() {
    const name = ref('');
    const subreddit = ref('');
    const optionSpeech = ref(false);
    const optionNews = ref(false);
    const message = ref('');

    async function onSubmit() {

      var formData = {
        "name": name.value,
        "subreddit": subreddit.value,
        "hateSpeech": optionSpeech.value,
        "fakeNews": optionNews.value,
      }

      console.log(formData);

      try {
        await axios.post('http://localhost:4000/postBot', formData);
        message.value = 'Bot Created!';
      } catch (err) {
        console.log(err);
        message.value = err;
      }
    };

    return {
      name,
      subreddit,
      optionSpeech,
      optionNews,
      onSubmit,
      message,
    };
  }
}
</script>

<style scoped>
h2 {
  font-weight: bold;
}

.menu {
  display: flex;
  padding: 50px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.bot-form {
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 40px 40px;
  padding: 20px;
}

.check {
  float: left;
  margin: 4px;
}
</style>