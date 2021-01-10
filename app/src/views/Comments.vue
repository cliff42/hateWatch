<template>
  <div class="menu">
    <h2>Comments</h2>
    <label class="refresh">
      <b-button variant="outline-primary" @click="onRefresh">Refresh</b-button>
    </label>
    <label class="filter-hate">
      <b-button variant="outline-primary" @click="filterHate">Filter Hate Speech</b-button>
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
    const hateOnly = ref(false);

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

      let response = [];
      comments.value = [];

      if (hateOnly.value) {
        response = await axios.get('http://localhost:4000/getHateComments');
      } else {
        response = await axios.get('http://localhost:4000/getAllComments');
      }

      response.data.forEach(comment => {
        comments.value.push({
          body: comment.body,
          author: comment.author,
        });
      });

      if (comments.value.length === 0) {
        comments.value.push({
          body: 'No comments',
          author: 'No comments',
        })
      }
    }

    function filterHate() {
      hateOnly.value = !hateOnly.value;

      onRefresh();
    }

    onRefresh();

    return {
      comments,
      fields,
      hateOnly,
      onRefresh,
      filterHate,
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

  .filter-hate {
    float: right;
    margin: 10px;
    margin-right: 20px;
  }
</style>