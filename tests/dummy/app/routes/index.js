import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return {
      email: 'user@example.com',
      number: '',
      country: 'de',
      isAdmin: null,
      collectCountry: true,
    };
  },

  setupController(controller, user) {
    controller.setProperties({ user });
  },
});
