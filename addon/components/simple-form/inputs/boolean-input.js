import Ember from 'ember';
import computed from 'ember-computed';

const { Checkbox } = Ember;
const { keys } = Object;
export default Checkbox.extend({
  inputAttributes: {},

  didReceiveAttrs() {
    let newInputAttrs = this.getAttr('inputAttributes') || {};
    keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });
  },

  isValid: true,

  classNameBindings: ['isValid:valid:invalid'],

  attributeBindings: ['checked'],

  checked: computed('value', {
    get() {
      let value = this.get('value');
      return !!value;
    }
  }),

  change(event) {
    this._super(event);
    this.sendAction('on-change', this.get('checked'));
  }
});
