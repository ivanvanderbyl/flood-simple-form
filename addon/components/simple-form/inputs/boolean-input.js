import Ember from 'ember';
import computed from 'ember-computed';

export default Ember.Checkbox.extend({
  inputAttributes: {},

  didReceiveAttrs() {
    const newInputAttrs = this.getAttr('inputAttributes') || {};
    Object.keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });
  },

  isValid: true,

  classNameBindings: ['isValid:valid:invalid'],

  attributeBindings: ['checked'],

  checked: computed('value', {
    get() {
      const value = this.get('value');
      return !!value;
    },
  }),

  change(event) {
    this._super(event);
    this.sendAction('on-change', this.get('checked'));
  },
});
