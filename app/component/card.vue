<template lang="html">
  <div class="card shadow">
    <button class="copy" type="button" v-clipboard="card.sentence"><img class="icon" :src="copyIcon">Copy</button>
    <div class="label"><icon name="clock-o"></icon> Memory</div>
    <p>{{card.sentence}}</p>
    <img v-if="card.attachments && card.attachments[0]" v-bind:src="card.attachments[0].url">
    <div class="logo">ForgetMeNot</div>
  </div>
</template>

<script>
import Vue from 'vue';
import Clipboards from 'vue-clipboards';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';

Vue.use(Clipboards);

export default {
  props: ['card'],
  data:function(){
    return {
      copyIcon: '../images/clipboard.svg',
    }
  },
  components:{
    icon: Icon
  }
}
</script>

<style lang="css">
  .card {
    position: relative;
    margin: 20px;
    width: calc(100% - 50px);
    max-width: 500px;
    min-height: 80px;
    padding: 15px 15px 40px 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  .card.shadow {
    width: calc(100% - 70px);
    box-shadow: 0px 0px 30px rgba(150,150,150,0.5);
    border: none;
  }
  .card button.copy {
    float: right;
    margin: -5px -5px 10px 20px;
    padding: 6px 12px;
    font-size: 12px;
  }
  .card .label {
    margin: 5px 5px 20px 5px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: bold;
  }
  .card .label, .card .label .fa-icon {
    color: #aaa;
  }
  .card img.icon {
    height: 1em;
    margin: 0 4px -1px 0px;
  }
  .card p, .card img {
    margin: 5px;
  }
  .card img {
    max-width: calc(100% - 10px);
    border-radius: 5px;
  }
  .card .logo {
    position: absolute;
    bottom: 15px;
    right: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #aaa;
  }

</style>
