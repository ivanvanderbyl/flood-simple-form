import Ember from 'ember';
import layout from '../../../templates/components/simple-form/inputs/block-input';

export default Ember.Component.extend({
  layout,

  username: 'Block Dummy Component',
  someInternalPropertyOnInput: "TEST"
});
