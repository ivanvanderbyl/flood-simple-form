import Route from 'ember-route';
export default Route.extend({
  setupController(controller) {
    controller.set('user', {});
  }
});
