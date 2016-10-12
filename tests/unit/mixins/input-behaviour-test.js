import Ember from 'ember';
import InputBehaviourMixin from 'flood-simple-form/mixins/input-behaviour';
import { module, test } from 'qunit';

module('Unit | Mixin | input behaviour');

const { Object: EO } = Ember;

test('it works', function(assert) {
  let InputBehaviourObject = EO.extend(InputBehaviourMixin);
  let subject = InputBehaviourObject.create();
  assert.ok(subject);
});
