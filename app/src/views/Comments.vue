<template>
  <div class="menu">
    <h2>Comments</h2>
    <label class="refresh">
      <b-button variant="outline-primary" @click="onRefresh">Refresh</b-button>
    </label>
    <table class="table table-striped">
      <thead>
        <th scope="col">User Name</th>
        <th scope="col">Comment</th>
      </thead>
      <tbody>
        <tr>
          <td scope="row" v-for="comment in comments" v-bind:key="comment.id">{{comment.name}}</td>
        </tr>
        <tr>
          <td scope="row" v-for="comment in comments" v-bind:key="comment.id">{{comment.text}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api';
import axios from 'axios';

export default {
  name: 'Comments',
  setup() {
    const comments = ref([{name:'test1', text:'comment1'}, {name:'test2', text:'comment2'}]);

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

.left-col {
  float:left;
}

.right-col {
  float: right;
}

</style>