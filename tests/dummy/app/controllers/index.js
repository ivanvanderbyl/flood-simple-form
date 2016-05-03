import Ember from 'ember';

export default Ember.Controller.extend({

  user: {
    email: 'user@example.com',
    number: '',
    country: {id: 'au', name: 'Australia'}
  },

  countries: [
    {id: 'au', name: 'Australia'},
    {id: 'us', name: 'United States'},
    {id: 'nz', name: 'New Zealand'},
  ],

  actions: {
    saveChanges(newData) {
      console.log(newData);

      return new Ember.RSVP.Promise((resolve) => {
        setTimeout(() => {
          Ember.setProperties(this.get('user'), newData);
          resolve();
        }, 1e3);
      });
    }
  }
});
