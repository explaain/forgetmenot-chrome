<template lang="html">
  <div class="card shadow" @mouseover="cardMouseover" @mouseout="cardMouseout" @click="cardClick" :class="{ highlight: card.highlight, editing: editing, updating: updating }">
    <!-- <ibutton class="cardDrag" icon="arrows" text=""></ibutton> -->
    <button class="copy" type="button" @click.stop="copy" v-clipboard="fullText"><img class="icon" :src="copyIcon">Copy</button>
    <div class="label"><span class="top-hit" v-if="card.highlight"><icon name="bolt"></icon> Top Hit</span><span class="type" v-if="full"><icon name="clock-o"></icon> Memory</span></div>
    <editable :content="text" :editable="editing" @update="text = $event" :style="{'font-size': fontSize }"></editable>
    <draggable v-model="listCards" :options="{ disabled: !editing, handle: '.drag', draggable: '.cardlet' }" class="list" v-if="listCards.length || editing">
      <cardlet v-for="item in listCards" :editing="editing" :card="item" :key="item.objectID" @cardletClick="cardletClick" @remove="removeListItem"></cardlet>
      <section class="buttons" v-if="editing">
        <ibutton class="left" icon="plus" text="Create List Item" :click="addListItem"></ibutton>
        <ibutton class="right" icon="search" text="Insert Card Into List" :click="toggleListSearch" :class="{selected: showListSearch}"></ibutton>
        <search v-if="showListSearch" @select="addListItem" :allCards="allCards" :setCard="setCard" :getUser="getUser"></search>
      </section>
    </draggable>
    <img v-if="full && card.attachments && card.attachments[0]" v-bind:src="card.attachments[0].url">
    <p class="spinner" v-if="!card"><icon name="refresh" class="fa-spin fa-3x"></icon></p>
    <p class="extractedFrom" v-if="full && card.extractedFrom">Extracted from <a v-bind:href="card.extractedFrom.url" target="_blank">{{card.extractedFrom.title}}</a></p>
    <footer v-if="full">
      <div class="buttons" v-if="!editing">
        <ibutton class="left delete" icon="trash" text="Delete" :click="deleteCard"></ibutton>
        <ibutton class="right edit" icon="pencil" text="Edit" :click="editCard"></ibutton>
      </div>
      <div class="buttons" v-if="editing">
        <ibutton class="left cancel" icon="close" text="Cancel" :click="cancelEdit"></ibutton>
        <ibutton class="right save" icon="check" text="Save" :click="saveEdit"></ibutton>
      </div>
      <div class="logo">ForgetMeNot</div>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue';
import Clipboards from 'vue-clipboards';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon.vue';
import Draggable from 'vuedraggable'
import IconButton from './ibutton.vue';
import Cardlet from './cardlet.vue';
import Editable from './editable.vue';
import Search from './search.vue';
import ExplaainAuthor from '../plugins/explaain-author.js';

Vue.use(Clipboards);

export default {
  props: [
    'data',
    'full',
    'allCards',
    'setCard',
    'getUser',
  ],
  components: {
    icon: Icon,
    ibutton: IconButton,
    cardlet: Cardlet,
    editable: Editable,
    draggable: Draggable,
    search: Search,
  },
  data: function(){
    return {
      card: {},
      tempListCards: {},
      editing: false,
      copyIcon: '../images/clipboard.svg',
      showListSearch: false,
    }
  },
  computed: {
    updating: function() {
      return this.card.updating || false
    },
    listCards: {
      get: function() {
        const self = this
        return self.card.content.listItems ? self.card.content.listItems.map(function(objectID) {
          return self.tempListCards[objectID] || JSON.parse(JSON.stringify(self.allCards[objectID] || null)) || { content: { description: 'Card Not Found' } }
        }) : []
      },
      set: function(newValue) { // Doesn't get called for deep events which could cause issues
        const self = this
        self.card.content.listItems = newValue.map(function(listCard) {
          self.tempListCards[listCard.objectID] = listCard // Is having this here good practice?
          return listCard.objectID
        })
      }
    },
    text: {
      get: function() {
        const text = this.card.content.description || ''
        if (!text || !text.length) console.log(text);
        return this.full ? text : text.trunc(100, true)
      },
      set: function(val) {
        this.card.content.description = val
      }
    },
    fullText: function() {
      return this.text + this.listCards.map(function(listCard) {
        return '\n- ' + listCard.content.description
      })
    },
    fontSize: function() {
      const self = this
      return 16 + 2*Math.floor(Math.min(5, 100/(self.text.length))) + 'px'
    }
  },
  watch: {
    data: {
      handler: function(val) {
        console.log('data data');
        console.log(this.editing);
        this.editing ? null : this.syncData()
      },
      deep: true
    },
    editing: function(val) {
      const self = this
      if (val) {
        self.listCards.forEach(function(listCard) {
          self.tempListCards[listCard.objectID] = JSON.parse(JSON.stringify(listCard))
        })
      }
    }
  },
  created: function() {
    this.syncData()
  },
  methods: {
    syncData: function() {
      console.log('sync');
      this.card = JSON.parse(JSON.stringify(this.data))
    },
    cardMouseover: function() {
      const self = this
      this.$emit('cardMouseover', self.card)
    },
    cardMouseout: function() {
      const self = this
      this.$emit('cardMouseout', self.card)
    },
    cardClick: function() {
      const self = this
      if (!this.editing) this.$emit('cardClick', self.card)
    },
    cardletClick: function(card) {
      if (!this.editing) this.$emit('cardClick', card)
    },
    editCard: function() {
      this.editing = true
    },
    deleteCard: function() {
      this.$emit('deleteCard', this.card.objectID)
    },
    cancelEdit: function() {
      this.syncData()
      this.editing = false
      // self.tempListCards = {} ????
    },
    saveEdit: function() {
      const self = this
      self.card.content.listCards = self.listCards
      self.listCards.forEach(function(listCard) {
        self.tempListCards[listCard.objectID] = listCard
      })
      self.$emit('updateCard', self.card, function(data) {
        self.tempListCards = {}
        self.syncData() // Shouldn't be necessary if data were properly being wtached deeply
      }, function(e) {
        console.log(e)
        self.tempListCards = {}
      })
      self.editing = false
    },
    addListItem: function(card) {
      console.log(card);
      const self = this
      if (!card) {
        card = {
          objectID: 'TEMP_' + Math.floor(Math.random()*10000000000),
          intent: 'storeMemory',
          content: {
            description: '',
          }
        }
      }
      self.tempListCards[card.objectID] = card
      if (!self.card.content.listItems) Vue.set(self.card.content, 'listItems', [])
      self.card.content.listItems.push(card.objectID)
    },
    removeListItem: function(data) {
      const listIndex = this.card.content.listItems.indexOf(data.objectID) // Doesn't account for same item appearing twice in list
      this.card.content.listItems.splice(listIndex, 1)
    },
    toggleListSearch: function() {
      console.log('toggleListSearch');
      console.log(this.showListSearch);
      this.showListSearch = !this.showListSearch
    },
    copy: function(e) {
      // The v-clipboard directive has already copied the text from the card - this function just shows the alert
      this.$emit('copy')
    }
  }
}

String.prototype.trunc = function( n, useWordBoundary ) {
  if (this.length <= n) { return this; }
  var subString = this.substr(0, n-1);
  return (useWordBoundary
    ? subString.substr(0, subString.lastIndexOf(' '))
    : subString) + "...";
}
</script>

<style lang="css">
  .card {
    position: relative;
    display: inline-block;
    vertical-align: top;
    margin: 10px;
    width: calc(100% - 50px);
    max-width: 320px;
    /*min-height: 80px;*/
    padding: 20px 10px 20px 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    word-wrap: break-word;
    overflow-wrap: break-word;
    background: white;
    cursor: pointer;
  }
  .card.updating {
    opacity: 0.5;
  }
  .card.shadow {
    width: calc(100% - 70px);
    box-shadow: 0px 0px 30px rgba(150,150,150,0.5);
    border: none;
  }
  @media (min-width: 600px) {
    .explorer:not(.sidebar) .main .card:not(.cardlet) {
      width: calc(50% - 50px);
    }
    .explorer:not(.sidebar) .main .card.shadow:not(.cardlet) {
      width: calc(50% - 70px);
    }
  }
  @media (min-width: 900px) {
    .explorer:not(.sidebar) .main .card:not(.cardlet) {
      width: calc(33.3% - 50px);
    }
    .explorer:not(.sidebar) .main .card.shadow:not(.cardlet) {
      width: calc(33.3% - 70px);
    }
  }
  .card.shadow:hover {
    box-shadow: 0px 0px 30px rgba(100,100,100,0.5);
  }
  .card.highlight {
    box-shadow: 0px 0px 30px rgba(255,211,35,0.7);
  }
  .card.highlight:hover {
    box-shadow: 0px 0px 30px rgba(255,211,35,1);
  }

  .editing:not(.non-editable) :not(.non-editable) .editable:not(.non-editable) {
    border: 2px dashed lightgrey;
    border-radius: 4px;
    color: black;
    cursor: text;
  }

  .card button.copy {
    float: right;
    margin: -15px -5px 10px 20px;
    padding: 6px 12px;
    font-size: 12px;
  }
  .card .label {
    margin: 5px 5px 20px 5px;
    padding: 5px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: bold;
    /*display: inline-block;*/
  }
  .card .label .top-hit, .card .label .top-hit svg {
    color: rgb(255,211,35)
  }
  .card .label, .card .label .fa-icon {
    color: #aaa;
  }
  .card img.icon {
    height: 1em;
    margin: 0 4px -1px 0px;
    padding: 0;
  }
  .card p, .card img, .card .editable {
    margin: 5px;
    padding: 5px;
  }
  .editing.card .editable.editing {
    margin: 3px;
  }
  .card p {
    white-space: pre-wrap;
  }
  .card img {
    max-width: calc(100% - 10px);
    border-radius: 5px;
  }
  .card .list {
    margin: 20px 0 10px;
  }
  .card .extractedFrom {
    font-size: 14px;
    color: #999;
    font-style: italic;
  }
  .card .extractedFrom a {
    color: #999;
    font-weight: bold;
    text-decoration: none;
  }
  .card .extractedFrom a:hover {
    border-bottom: 4px solid rgb(255,211,35);
  }
  footer {
    min-height: 40px;
  }
  section.buttons {
    margin: 10px;
  }
  .card footer .buttons {
    position: absolute;
    bottom: 15px;
    left: 20px;
    margin: 10px 20px -5px -16px;
    padding: 6px 12px;
  }
  .card .buttons button {
    padding: 6px 12px;
    margin: -2px;
    font-size: 12px;
  }
  .card .buttons button:focus {
    outline:none;
  }
  .card button.left {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .card button.delete:hover {
    background: #ffaaaa;
  }
  .card button.right {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .card button.cancel {
    background: #ffb6c9;
  }
  .card button.save {
    background: #b8ecc0;
  }
  .card button.selected {
    background: #ddd;
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
