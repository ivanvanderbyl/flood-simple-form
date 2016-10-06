import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
import isPromise from 'flood-simple-form/utils/is-promise';
// import pureAssign from 'ember-changeset/utils/assign';
const { assert, isPresent, get, typeOf } = Ember;

function isFunction(thing) {
  return typeOf(thing) === 'function';
}

const SECTIONS = '_sections';

const SimpleFormComponent = Component.extend({
  layout,

  tagName: 'form',
  classNames: ['SimpleForm'],

  disabled: false,

  attributeBindings: ['disabled'],

  [SECTIONS]: null,

  init() {
    this[SECTIONS] = new Map();
    this._super();
  },

  /**
   * Changeset to propagate changes to.
   *
   * @isFunction(thing);
   * @public
   * @type {EmberChangeset}
   */
  changeset: null,

  errors: computed(SECTIONS, 'changeset.errors', {
    get() {
      let sections = this[SECTIONS];
      let changeset = get(this, 'changeset');
      let errors = [];
      let values = sections.values() || [];

      assert('changeset must be set when creating a simple-form', isPresent(changeset));

      [changeset, ...values].forEach((changeset) => {
        errors = [...errors, ...get(changeset, 'errors')];
      });

      return errors;
    }
  }),

  changes: computed(SECTIONS, 'changeset.changes', {
    get() {
      let sections = this[SECTIONS];
      let changeset = get(this, 'changeset');
      let changes = [];
      let values = sections.values() || [];

      [changeset, ...values].forEach((changeset) => {
        changes = changes.concat(get(changeset, 'changes'));
        // changes = [...changes, ...get(changeset, 'changes')];
      });

      return changes;
    }
  }),

  isValid: computed.empty('errors'),
  isInvalid: computed.not('isValid'),

  submit(event) {
    event.preventDefault();
    this.send('submitForm');
  },

  actions: {
    inputValueChanged(field, value) {
      get(this, 'changeset').set(field, value);
      this.propertyDidChange('changeset');
      this.sendAction('on-change', get(this, 'changeset'));
    },

    inputDidBlur(/* field, value */) {
    },

    inputDidFocus(/* field, value */) {
    },

    mergeSectionChangeset({ id, changeset }) {
      if (!this[SECTIONS].has(id)) {
        this[SECTIONS].set(id, changeset);
      }

      this.propertyDidChange(SECTIONS);
    },

    invalidateSection({ id }) {
      get(this, SECTIONS).delete(id);
      this.propertyDidChange(SECTIONS);
    },

    rollback() {
      let changeset = get(this, 'changeset');
      return changeset.rollback();
    },

    submitForm() {
      let masterChangeset = get(this, 'changeset');
      let sections = this[SECTIONS];

      let changesets = [...sections.values()];

      changesets.forEach((changeset) => {
        masterChangeset = masterChangeset.merge(changeset);
      });

      if (isFunction(this.getAttr('on-submit'))) {
        let result = this.getAttr('on-submit')(masterChangeset);
        if (isPromise(result)) {
          this.set('disabled', true);
          result.then((shouldEnableForm) => {
            if (shouldEnableForm !== false) {
              this.set('disabled', false);
            }
          }, () => this.set('disabled', false));
        }
      }
    }
  }

});

SimpleFormComponent.reopenClass({
  positionalParams: ['changeset']
});

export default SimpleFormComponent;
