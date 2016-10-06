import Ember from 'ember';
import InputBehaviour from 'flood-simple-form/mixins/input-behaviour';

const { TextField } = Ember;

export default TextField.extend(InputBehaviour, {
  _elementValueDidChange(event) {
    this._super(event);
    this.sendAction('on-change', this.get('value'));
  }
});
