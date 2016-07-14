import Ember from 'ember';

export default Ember.Mixin.create({
  inputAttributes: {},

  isValid: true,

  classNameBindings: ['isValid:valid:invalid'],

  didReceiveAttrs({ newAttrs }) {
    const newInputAttrs = newAttrs.inputAttributes.value || {};
    Object.keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });

    this._super({ newAttrs });
  },

  focusIn() {
    this.sendAction('focus-in');
  },

  focusOut() {
    this.sendAction('focus-out');
  },
});
