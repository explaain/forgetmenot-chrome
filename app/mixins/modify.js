import Q from 'q';
import Algolia from 'algoliasearch';

const AlgoliaClient = Algolia('I2VKMNNAXI', '2b8406f84cd4cc507da173032c46ee7b');
const AlgoliaIndex = AlgoliaClient.initIndex('ForgetMeNot_Context');

// define a mixin object
export default {
  methods: {
    createMemory: function(data) {
      const self = this;
      if (!data.text) data.text = 'Hello'
      console.log('data: ', data);
      const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
      data.sender = self.userID;
      this.axios.post(url, data)
      .then((response) => {
        console.log('Card successfully created');
        console.log(response)
        self.query = '';
        self.cards = [];
        self.showAlert('success', 2000, 'Card created!')
      }).catch(function (e) {
        console.log(e);
      });
    },
    editMemory: function(data) {
      const self = this;
      console.log('data: ', data);
      const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
      data.sender = self.userID;
      this.axios.post(url, data)
      .then((response) => {
        console.log('Card successfully edited');
        console.log(response)
        self.query = '';
        // self.cards = [];
        self.showAlert('success', 2000, 'Card updated!')
      }).catch(function (e) {
        console.log(e);
      });
    },
    deleteMemory: function(objectID) {
      const self = this;
      const url = 'http://forget-me-not--staging.herokuapp.com/api/memories'
      const data = {
        objectID: objectID
      }
      data.sender = self.userID;
      console.log('data: ', data);
      this.axios.delete(url, {params: data})
      .then((response) => {
        console.log('Card successfully deleted');
        console.log(response)
        self.query = '';
        // self.cards = [];
        self.showAlert('success', 2000, 'Card deleted!')
      }).catch(function (e) {
        console.log(e);
      });
    },
  }
}
