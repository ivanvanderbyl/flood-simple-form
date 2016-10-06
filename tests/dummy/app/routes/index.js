import Route from 'ember-route';
export default Route.extend({
  model() {
    return {
      email: 'user@example.com',
      number: '',
      country: 'de',
      isAdmin: null,
      collectCountry: true
    };
  },

  setupController(controller, user) {
    controller.setProperties({ user });
  }
});
