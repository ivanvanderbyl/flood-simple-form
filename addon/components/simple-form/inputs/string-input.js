import Ember from 'ember';
import InputBehaviour from 'flood-simple-form/mixins/input-behaviour';

export default Ember.TextField.extend(InputBehaviour, {
  _elementValueDidChange(event) {
    this._super(event);
    this.sendAction('on-change', this.get('value'));
  },
});
