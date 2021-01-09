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
      <b-form-group class="checkbox">
          <b-form-checkbox v-model="optionSpeech" class="check">
          Detect Hate Speech
          </b-form-checkbox>
          <b-form-checkbox v-model="optionNews" class="check">
          Detect Fake News
          </b-form-checkbox>
      </b-form-group>
      <b-button variant="outline-primary">Deploy</b-button>
    </b-form>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';

export default {
  name: 'Home',
  setup() {
    const name = ref('');
    const subreddit = ref('');
    const optionSpeech = ref('');
    const optionNews = ref('');

    return {
      name,
      subreddit,
      optionSpeech,
      optionNews
    };
  }
}
</script>

<style scoped>
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
  /* justify-content: left; */
  /* align-items: center;
  justify-content: center; */
}

.input {
  /* width: 100%; */
}

.check {
  float: left;
  margin: 4px;
}
</style>
