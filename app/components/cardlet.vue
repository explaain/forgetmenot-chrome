<template lang="html">
  <div class="card cardlet">
    <p>{{card.sentence}}</p>
    <p>{{card.description}}</p>
  </div>
</template>

<script>
import Vue from 'vue';

import ExplaainSearch from '../plugins/explaain-search.js';

import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';

export default {
  props: ['card'],
  data: function(){
    return {

    }
  },
  components: {
    icon: Icon,
  },
  methods: {
  }
}
</script>

<style lang="css">

  .cardlet {
    margin: 0 8px -1px;
    min-height: unset;
    padding: 8px 15px;
    border-radius: 0;
    width: calc(100% - 50px);
    border-color: #e4e4e4;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
  }
  .cardlet:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .cardlet:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .cardlet:hover {
    background: #eee;
  }

</style>
