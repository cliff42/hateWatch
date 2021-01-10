<template>
  <div class="menu">
    <h2>Comments</h2>
    <label class="refresh">
      <b-button variant="outline-primary" @click="onRefresh">Refresh</b-button>
    </label>
    <ul>
      <li v-for="comment in comments" v-bind:key="comment.id">{{comment.text}}</li>
    </ul>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Comments',
  setup() {
    const comments = ref('');

    async function onRefresh() {

      try {
        comments = await axios.get('http://localhost:4000/getCommentData');
      } catch (err) {
        console.log(err);
      }
    };

    return {
      comments,
    };
  }
}
</script>

<style scoped>

</style>