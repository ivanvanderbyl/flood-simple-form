import Ember from 'ember';
import Component from 'ember-component';
import layout from '../../../templates/components/simple-form/inputs/select-input';
import InputBehaviour from 'flood-simple-form/mixins/input-behaviour';

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

  sortArray: Ember.computed('sortBy', function(){
    if (this.get('sortBy')){
      return this.get('sortBy').replace(' ', '').split(',');
    }
    return [];
  }),

  sortedContent: Ember.computed.sort('collection', 'sortArray'),

  change(event) {
    const target = event.target;
    this.send('onChange', target);
  },

  actions: {
    onChange(target){
      let value = Ember.$(target).val(),
          selection;

      //if multiple, .val() returns an array. if not, it's a single value
      if (this.get('multiple')){
        let values = Ember.A(value);
        selection = values;
      } else {
        selection = value;
      }

      if (this.getAttr('on-change')){
        this.getAttr('on-change')(selection);
      }

    },
  }
});
