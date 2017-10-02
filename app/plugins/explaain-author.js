import Vue from 'vue';
import Q from 'q';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios)

const Author = {
  install(Vue, options) {
    console.log(options);
    var url = options.url;
    console.log(url);

    const importFromDrive = function(user) {
      const d = Q.defer()
      Vue.axios.post(options.importUrl, user)
      .then((response) => {
        d.resolve(response)
      }).catch(function(e) {
        console.log(e);
      })
      return d.promise
    }

    const createCard = function(data) {
      const d = Q.defer()
      const self = this;
      console.log('url: ', url);
      console.log('data: ', data);
      Vue.axios.post(url, data)
      .then((response) => {
        console.log('Card successfully created');
        console.log(response)
        // self.showAlert('success', 2000, 'Card created!')
        data.callback();
      }).catch(function(e) {
        console.log(e);
      });
      return d.promise
    }

    const editCard = function(data) {
      const d = Q.defer()
      const self = this;
      console.log('data: ', data);
      Vue.axios.post(url, data)
      .then((response) => {
        console.log('Card successfully edited');
        console.log(response)
        self.query = '';
        // self.cards = [];
        // self.showAlert('success', 2000, 'Card updated!')
        data.callback();
      }).catch(function (e) {
        console.log(e);
      });
      return d.promise
    }

    const deleteCard = function(data) {
      const d = Q.defer()
      const self = this;
      console.log('data: ', data);
      Vue.axios.delete(url, {params: data})
      .then((response) => {
        console.log('Card successfully deleted');
        console.log(response)
        self.query = '';
        // self.cards = [];
        // self.showAlert('success', 2000, 'Card deleted!')
        d.resolve()
        // data.callback();
      }).catch(function (e) {
        console.log(e);
        d.reject()
      });
      return d.promise
    }

    this.importFromDrive = importFromDrive;
    this.createCard = createCard;
    this.editCard = editCard;
    this.deleteCard = deleteCard;
  },

}

export default Author;
