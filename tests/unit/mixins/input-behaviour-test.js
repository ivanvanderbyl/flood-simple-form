import Ember from 'ember';
import InputBehaviourMixin from 'flood-simple-form/mixins/input-behaviour';
import { module, test } from 'qunit';

module('Unit | Mixin | input behaviour');

// Replace this with your real tests.
test('it works', function(assert) {
  let InputBehaviourObject = Ember.Object.extend(InputBehaviourMixin);
  let subject = InputBehaviourObject.create();
  assert.ok(subject);
});
