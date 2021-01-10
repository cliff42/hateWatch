<template>
  <div class="menu">
    <h2>Comments</h2>
    <label class="refresh">
      <b-button variant="outline-primary" @click="onRefresh">Refresh</b-button>
    </label>
    <div class="table">
      <b-table striped hover bordered :items="comments" :fields="fields">
      </b-table>
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Comments',
  setup() {
    const comments = ref([]);
    const fields = ref([]);

    fields.value = [
      {
        key: 'author',
        label: 'Author',
        sortable: true
      },
      {
        key: 'body',
        label: 'Comment',
        sortable: true
      },
    ];

    async function onRefresh() {

      const response = await axios.get('http://localhost:4000/getAllComments');

      response.data.forEach(comment => {
        comments.value.push({
          body: comment.body,
          author: comment.author,
        });
      });
    }

    onRefresh();

    return {
      comments,
      fields,
      onRefresh,
    };
  }
}
</script>

<style scoped>
  .refresh {
    float: right;
    margin: 10px;
    margin-right: 20px;
  }
</style>