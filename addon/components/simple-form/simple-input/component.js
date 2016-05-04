import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
const {
  get,
  isPresent,
  String: { dasherize },
} = Ember;

const INLINE_TYPES = {
  boolean: true,
};

const DEFAULT_TYPE = 'string';

const InputComponent = Component.extend({
  layout,

  tagName: 'div',
  classNames: ['SimpleForm-input'],
  classNameBindings: ['_inputClassName'],

  /**
   * The underlying input type (name of component to render).
   *
   * SimpleForm will look for any component in the path `simple-form/inputs/{type}-input`
   *
   * @type {String}
   */
  type: DEFAULT_TYPE,

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

  /**
   * Display label inline with input element.
   *
   * @type {Boolean}
   */
  inline: computed('type', {
    get() {
      const type = this.get('type');
      return INLINE_TYPES[type] === true;
    }
  }),

  isInputFirst: computed.alias('inline'),

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

  hasInlineLabel: computed('inline', 'label', function() {
    return this.get('inline') && isPresent(this.get('label'));
  }),

  _inputClassName: computed('modelAttr', {
    get() {
      const modelAttr = this.get('modelAttr') || '';
      return dasherize(modelAttr).toLowerCase();
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
      this.sendAction('on-change', newValue);
      this.sendAction('internal-on-change', modelAttr, newValue);
    }
  }
});

InputComponent.reopenClass({
  positionalParams: ['modelAttr'],
});

export default InputComponent;
