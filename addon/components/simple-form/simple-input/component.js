import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
const { get, isPresent } = Ember;

const InputComponent = Component.extend({
  layout,

  tagName: 'div',
  classNames: ['SimpleForm-input'],
  classNameBindings: ['modelAttr'],

  /**
   * The underlying input type (name of component to render).
   *
   * SimpleForm will look for any component in the path `simple-form/inputs/{type}-input`
   *
   * @type {String}
   */
  type: 'text',

  /**
   * The model attribute to apply to this input.
   *
   * This will be used to supply the current value to the input, and when the input
   * fires an on-change action, it will eventually be propagated as `{modelAttr}: {value}`.
   *
   * @type {String}
   */
  modelAttr: null,

  errors: [],
  hasErrors: computed.notEmpty('errors'),

  hint: null,
  hasHint: computed.notEmpty('hint'),
  hintMessage: computed.alias('hint'),

  initialValue: computed('initialValues.@each', 'modelAttr', {
    get() {
      const initialValues = this.get('initialValues');
      const modelAttr = this.get('modelAttr');
      if (modelAttr && isPresent(initialValues)) {
        return get(initialValues, modelAttr);
      }
    }
  }),

  inputElementId: computed('elementId', {
    get() {
      const elementId = this.get('elementId');
      return `${elementId}-input`;
    }
  }),

  inputComponentName: computed('type', {
    get() {
      const type = this.get('type');
      return `simple-form/inputs/${type}-input`;
    }
  }),

  didReceiveAttrs({ newAttrs }) {
    const restrictedAttrs = ['classNames', 'type', 'hint', 'tagName', 'initialValues'];
    let inputAttributes = Object.keys(newAttrs).reduce((inputAttrs, key) => {
      if (restrictedAttrs.indexOf(key) === -1) {
        inputAttrs[key] = this.getAttr(key);
      }

      return inputAttrs;
    }, {});
    this.set('inputAttributes', inputAttributes);
  },

  actions: {
    inputValueChanged(newValue) {
      const modelAttr = this.get('modelAttr');
      this.sendAction('on-change', modelAttr, newValue);
    }
  }
});

InputComponent.reopenClass({
  positionalParams: ['modelAttr'],
});

export default InputComponent;
