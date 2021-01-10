<template>
  <div class="menu">
    <h2>Comments</h2>
    <label class="refresh">
      <b-button variant="outline-primary" @click="onRefresh">Refresh</b-button>
    </label>
    <label class="filter-hate">
      <b-form-checkbox variant="outline-primary" @change="filterHate" aria-checked="false">Only Hate Speech Filter</b-form-checkbox>
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
        key: 'subreddit',
        label: 'Subreddit',
        sortable: true
      },
      {
        key: 'body',
        label: 'Comment',
        sortable: true
      },
      {
        key: 'certainty',
        label: 'Confidence',
        sortable: true
      }
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
        console.log(comment.certainty);
        comments.value.push({
          body: comment.body,
          author: comment.author,
          subreddit: comment.subreddit,
          certainty: String(comment.certainty * 100).substring(0, 6) + " %"
        });
      });

      if (comments.value.length === 0) {
        comments.value.push({
          body: 'No comments found',
          author: 'No comments found',
          subreddit: 'N/A',
          certainty: 'N/A'
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
h2 {
  font-weight: bold;
}

.menu {
  display: flex;
  flex-direction: column;
  padding: 50px;
  align-items: center;
  justify-content: center;
}

.table {
  margin-top:0px;
}

.refresh {
  float: right;
  margin: 10px;
  margin-right: 8px;
  margin-left: 1220px;
}

.filter-hate {
  float: right;
  margin: 10px;
  margin-top:0px;
  margin-right: 20px;
  margin-left: 1110px;
}
</style>