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

  initialValues: {},
  initialErrors: {},

  /**
   * The underlying input type (name of component to render).
   *
   * SimpleForm will look for any component in the path `simple-form/inputs/{type}-input`
   *
   * @type {String}
   */
  type: DEFAULT_TYPE,

  /**
   * Used internally for validation lifecycle
   *
   * @type {String}
   */
  _value: null,

  /**
   * The model attribute to apply to this input.
   *
   * This will be used to supply the current value to the input, and when the input
   * fires an on-change action, it will eventually be propagated as `{modelAttr}: {value}`.
   *
   * @type {String}
   */
  modelAttr: null,
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

  errors: computed('initialErrors.@each', 'modelAttr', {
    get() {
      const errors = this.get('initialErrors');
      const modelAttr = this.get('modelAttr');
      if (modelAttr && isPresent(errors)) {
        return get(errors, modelAttr);
      }
    }
  }),

  errorMessages: computed('errors', {
    get() {
      return this.get('errors')[0];
    }
  }),

  isValid: computed.empty('errors'),
  isInvalid: computed.not('isValid'),

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

  inputHasFocus: false,

  /**
   * Indicates whether errors are currently being shown. This state is based on the
   * following life cycle:
   *
   * 1. If errors are present on this attr, show them,
   * 2. When a field starts off as empty, don't validate until it blurs after having focus,
   * 3. When a field has errors and gains focus, validate on all change events.
   *
   * @type {Boolean}
   */
  shouldDisplayErrors: true,

  didReceiveAttrs({ newAttrs }) {
    const restrictedAttrs = ['classNames', 'type', 'hint', 'tagName', 'initialValues', 'initialErrors'];
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
      this.set('_value', newValue);
      const modelAttr = this.get('modelAttr');
      const isInvalid = this.get('isInvalid');
      this.sendAction('on-change', newValue);
      this.sendAction('internal-on-change', modelAttr, newValue);

      const hasFocus = this.get('inputHasFocus');
      if (hasFocus && isInvalid) {
        this.sendAction('internal-on-change-for-validation', modelAttr, newValue);
      }
    },

    inputGainedFocus() {
      this.set('inputHasFocus', true);
    },

    inputLostFocus() {
      this.set('inputHasFocus', false);
      const modelAttr = this.get('modelAttr');
      const value = this.get('_value');
      this.sendAction('internal-on-change-for-validation', modelAttr, value);
    },
  }
});

InputComponent.reopenClass({
  positionalParams: ['modelAttr'],
});

export default InputComponent;
