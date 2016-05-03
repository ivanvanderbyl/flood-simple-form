import Ember from 'ember';

export default Ember.TextField.extend({
  inputAttributes: {},

  didReceiveAttrs({newAttrs}) {
    const newInputAttrs = newAttrs.inputAttributes.value || {};
    Object.keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });
  },

  _elementValueDidChange(event) {
    this._super(event);
    this.sendAction('on-change', this.get('value'));
  },
});
