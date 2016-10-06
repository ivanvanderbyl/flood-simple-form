import Ember from 'ember';
import Component from 'ember-component';
import layout from '../../../templates/components/simple-form/inputs/select-input';
import InputBehaviour from 'flood-simple-form/mixins/input-behaviour';

const { computed, $, A } = Ember;

export default Component.extend(InputBehaviour, {
  layout,

  tagName: 'select',
  classNames: ['SimpleForm-select'],

  optionValuePath: 'id',
  optionLabelPath: 'title',
  optionDisabledKey: null,
  selected: null,
  placeholder: 'Select an option',
  sortBy: null,
  multiple: false,
  disabled: false,

  attributeBindings: ['multiple', 'disabled'],

  sortArray: computed('sortBy', function() {
    if (this.get('sortBy')) {
      return this.get('sortBy').replace(' ', '').split(',');
    }

    return [];
  }),

  sortedContent: computed.sort('collection', 'sortArray'),

  change(event) {
    let { target } = event;
    this.send('onChange', target);
  },

  actions: {
    onChange(target) {
      let value = $(target).val();
      let selection;

      // if multiple, .val() returns an array. if not, it's a single value
      if (this.get('multiple')) {
        let values = A(value);
        selection = values;
      } else {
        selection = value;
      }

      this.sendAction('on-change', selection);
    }
  }
});
