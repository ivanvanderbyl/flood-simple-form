import Ember from 'ember';
import TedSelect from 'ember-ted-select/components/ted-select';
// import layout from 'ember-ted-select/templates/components/ted-select';

import layout from '../../../templates/components/simple-form/inputs/select-input';

const { computed, get } = Ember;

export default TedSelect.extend({
  layout,

  didReceiveAttrs({newAttrs}) {
    const newInputAttrs = newAttrs.inputAttributes.value || {};
    Object.keys(newInputAttrs).forEach((key) => {
      this.set(key, newInputAttrs[key]);
    });
  },

  prompt: computed.alias('placeholder'),
  content: computed.alias('collection'),
  selected: computed.oneWay('value'),

  actions: {
    onChange(target){
      let value = Ember.$(target).val(),
          selection;

      //if multiple, .val() returns an array. if not, it's a single value
      if (this.get('multiple')){
        let values = Ember.A(value);
        selection = this.get('content').filter(option => {
          let optionVal = Ember.get(option, this.get('optionValueKey')).toString();
          return values.contains(optionVal);
        });
      } else {
        selection = this.get('content').find(option => {
          return Ember.get(option, this.get('optionValueKey')).toString() === value;
        });
      }

      if (this.getAttr('on-change')){
        this.getAttr('on-change')(selection);
      }

    },
  }
});
