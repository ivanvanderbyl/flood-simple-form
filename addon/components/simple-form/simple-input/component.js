import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
const {
  get,
  isPresent,
  String: { dasherize }
} = Ember;

const INLINE_TYPES = {
  boolean: true
};

const DEFAULT_TYPE = 'string';
const restrictedAttrs = ['classNames', 'type', 'hint', 'tagName',
  'changeset', 'errors', '_change', '_change'
];

const InputComponent = Component.extend({
  layout,

  tagName: 'div',
  classNames: ['SimpleForm-input'],
  classNameBindings: ['_inputClassName'],

  changeset: {},

  inputAttributes: {},

  /**
   * The underlying input type (name of component to render).
   *
   * SimpleForm will look for any component in the path `simple-form/inputs/{type}-input`
   *
   * @public
   * @type {String}
   */
  type: DEFAULT_TYPE,

  /**
   * The model attribute to apply to this input.
   *
   * This will be used to supply the current value to the input, and when the input
   * fires an on-change action, it will eventually be propagated as `{modelAttr}: {value}`.
   *
   * @public
   * @type {String}
   */
  modelAttr: null,

  hasErrors: computed.notEmpty('errorsForInput'),
  hint: null,
  hasHint: computed.notEmpty('hint'),
  hintMessage: computed.alias('hint'),

  /**
   * Display label inline with input element.
   *
   * @public
   * @type {Boolean}
   */
  inline: computed('type', {
    get() {
      let type = get(this, 'type');
      return INLINE_TYPES[type] === true;
    }
  }),

  isInputFirst: computed.alias('inline'),

  errorsForInput: computed('changeset.errors.[]', 'modelAttr', {
    get() {
      let errors = get(this, 'changeset.errors') || [];
      let modelAttr = get(this, 'modelAttr');
      return errors.filter((error) => error.key === modelAttr);
    }
  }),

  errorMessages: computed('errorsForInput.[]', {
    get() {
      let errors = get(this, 'errorsForInput');
      return errors.map((error) => error.validation);
    }
  }),

  isValid: computed.empty('errorsForInput'),
  isInvalid: computed.not('isValid'),

  inputElementId: computed('elementId', {
    get() {
      let elementId = get(this, 'elementId');
      return `${elementId}-input`;
    }
  }),

  inputComponentName: computed('type', {
    get() {
      let type = get(this, 'type');
      return `simple-form/inputs/${type}-input`;
    }
  }),

  hasInlineLabel: computed('inline', 'label', function() {
    return get(this, 'inline') && isPresent(get(this, 'label'));
  }),

  _inputClassName: computed('modelAttr', {
    get() {
      let modelAttr = get(this, 'modelAttr') || '';
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
   * @deprecated This isn't needed with validated changesets
   * @private
   * @type {Boolean}
   */
  shouldDisplayErrors: true,

  didReceiveAttrs({ newAttrs }) {
    let inputAttributes = Object.keys(newAttrs).reduce((inputAttrs, key) => {
      if (restrictedAttrs.indexOf(key) === -1) {
        inputAttrs[key] = this.getAttr(key);
      }

      return inputAttrs;
    }, {});

    let changeset = this.getAttr('changeset');
    let modelAttr = get(this, 'modelAttr');

    if (modelAttr && isPresent(changeset)) {
      this.set('value', get(changeset, modelAttr));
    }

    this.set('inputAttributes', inputAttributes);
  },

  actions: {
    inputValueChanged(newValue) {
      let modelAttr = get(this, 'modelAttr');
      this.sendAction('_change', modelAttr, newValue);
      this.sendAction('on-change', newValue);
    },

    inputGainedFocus() {
      this.set('inputHasFocus', true);
      let value = get(this, 'value');
      let modelAttr = get(this, 'modelAttr');
      this.sendAction('internal-input-focus', modelAttr, value);
      this.sendAction('input-focus', modelAttr, value);
    },

    inputLostFocus() {
      this.set('inputHasFocus', false);
      let value = get(this, 'value');
      let modelAttr = get(this, 'modelAttr');
      this.sendAction('internal-input-blur', modelAttr, value);
      this.sendAction('input-blur', modelAttr, value);
    }
  }
});

InputComponent.reopenClass({
  positionalParams: ['modelAttr']
});

export default InputComponent;
