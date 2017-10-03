<template lang="html">
  <div class="card shadow" v-on:mouseover="cardMouseover" v-on:mouseout="cardMouseout" v-on:click="cardClick" :class="{ highlight: card.highlight }">
    <button class="copy" type="button" @click="copy" v-clipboard="card.sentence"><img class="icon" :src="copyIcon">Copy</button>
    <div class="label highlight" v-if="card.highlight"><icon name="bolt"></icon> Top Hit</div>
    <div class="label"><icon name="clock-o"></icon> Memory</div>
    <p>{{card.sentence}}</p>
    <p>{{card.description}}</p>
    <div class="list">
      <cardlet v-for="item in card.listCards" :card="item" :key="item.objectID"></cardlet>
    </div>
    <img v-if="card.attachments && card.attachments[0]" v-bind:src="card.attachments[0].url">
    <footer v-if="full">
      <div class="buttons">
        <ibutton class="delete" icon="trash" text="Delete" :click="deleteCard"></ibutton>
        <ibutton class="edit" icon="pencil" text="Edit" :click="editCard"></ibutton>
      </div>
      <div class="logo">ForgetMeNot</div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import IconButton from './ibutton.vue';
import Cardlet from './cardlet.vue';

import Clipboards from 'vue-clipboards';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';

Vue.use(Clipboards);

export default {
  props: [
    'card',
    'full'
  ],
  data: function(){
    return {
      copyIcon: '../images/clipboard.svg',
    }
  },
  components: {
    icon: Icon,
    ibutton: IconButton,
    cardlet: Cardlet,
  },
  methods: {
    cardMouseover: function() {
      const self = this
      this.$emit('cardMouseover', self.card)
    },
    cardMouseout: function() {
      const self = this
      this.$emit('cardMouseout', self.card)
    },
    cardClick: function(a) {
      const self = this
      this.$emit('cardClick', self.card)
    },
    editCard: function() {
      this.$emit('editCard', this.card.objectID, this.card.sentence)
    },
    deleteCard: function() {
      this.$emit('deleteCard', this.card.objectID)
    },
    copy: function() {
      // The v-clipboard directive has already copied the text from the card - this function just shows the alert
      this.$emit('copy')
    }
  }
}
</script>

<style lang="css">
  .card {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin: 20px;
    width: calc(100% - 50px);
    max-width: 320px;
    min-height: 80px;
    padding: 15px 15px 40px 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    background: white;
    cursor: pointer;
  }
  .card.shadow {
    width: calc(100% - 70px);
    box-shadow: 0px 0px 30px rgba(150,150,150,0.5);
    border: none;
  }
  @media (min-width: 600px) {
    .explorer:not(.sidebar) .card {
      width: calc(50% - 50px);
    }
    .explorer:not(.sidebar) .card.shadow {
      width: calc(50% - 70px);
    }
  }
  @media (min-width: 900px) {
    .explorer:not(.sidebar) .card {
      width: calc(33.3% - 50px);
    }
    .explorer:not(.sidebar) .card.shadow {
      width: calc(33.3% - 70px);
    }
  }
  .card.shadow:hover {
    box-shadow: 0px 0px 30px rgba(100,100,100,0.5);
  }
  .card.highlight {
    box-shadow: 0px 0px 30px rgba(18,114,219,0.5);
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
    display: inline-block;
  }
  .card .label.highlight, .card .label.highlight svg {
    color: rgb(18,114,219)
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
  .card .list {
    margin: 20px 0 10px;
  }
  footer {
    min-height: 20px;
  }
  .card footer .buttons {
    position: absolute;
    bottom: 15px;
    left: 20px;
    margin: 10px 20px -5px -16px;
    padding: 6px 12px;
  }
  .card button.delete, .card button.edit {
    padding: 6px 12px;
    margin: -2px;
    font-size: 12px;
  }
  .card button.delete {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .card button.delete:hover {
    background: #ffaaaa;
  }
  .card button.edit {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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
