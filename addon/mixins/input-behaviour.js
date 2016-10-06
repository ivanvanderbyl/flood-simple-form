import Mixin from 'ember-metal/mixin';

const { keys } = Object;

export default Mixin.create({
  inputAttributes: {},

  isValid: true,

  classNameBindings: ['isValid:valid:invalid'],

  didReceiveAttrs({ newAttrs }) {
    let newInputAttrs = newAttrs.inputAttributes.value || {};
    keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });

    this._super({ newAttrs });
  },

  focusIn() {
    this.sendAction('focus-in');
  },

  focusOut() {
    this.sendAction('focus-out');
  }
});
