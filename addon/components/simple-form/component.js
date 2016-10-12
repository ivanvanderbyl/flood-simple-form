import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
import isPromise from 'flood-simple-form/utils/is-promise';
import MergeSupport, { compositeChangeset } from 'flood-simple-form/mixins/merge-support';

// import pureAssign from 'ember-changeset/utils/assign';
const { assert, isPresent, get, typeOf } = Ember;

function isFunction(thing) {
  return typeOf(thing) === 'function';
}

const SECTIONS = '_sections';

const SimpleFormComponent = Component.extend(MergeSupport, {
  layout,

  tagName: 'form',
  classNames: ['SimpleForm'],

  disabled: false,

  attributeBindings: ['disabled'],

  /**
   * Changeset to propagate changes to.
   *
   * @isFunction(thing);
   * @public
   * @type {EmberChangeset}
   */
  changeset: null,

  errors: computed.reads('compositeChangeset.errors'),

  // errors: computed(SECTIONS, 'changeset.errors.[]', {
  //   get() {
  //     let sections = this[SECTIONS];
  //     let changeset = get(this, 'changeset');
  //     let errors = [];
  //     let changesets = sections.values() || [];

  //     assert('changeset must be set when creating a simple-form', isPresent(changeset));

  //     let allChangesets = [changeset, ...changesets];
  //     allChangesets.forEach((changeset) => {
  //       errors = [...errors, ...get(changeset, 'errors')];
  //     });

  //     // console.log(sections.size, allChangesets.length);

  //     return errors;
  //   }
  // }),

  changes: computed.reads('compositeChangeset.changes'),

  // changes: computed(SECTIONS, 'changeset.changes.[]', {
  //   get() {
  //     let sections = this[SECTIONS];
  //     let changeset = get(this, 'changeset');
  //     let changes = [];
  //     let changesets = sections.values() || [];

  //     [changeset, ...changesets].forEach((changeset) => {
  //       changes = changes.concat(get(changeset, 'changes'));
  //     });

  //     return changes;
  //   }
  // }),

  isValid: computed.empty('errors'),
  isInvalid: computed.not('isValid'),

  submit(event) {
    event.preventDefault();
    this.send('submitForm');
  },

  actions: {
    inputValueChanged(field, value) {
      let changeset = get(this, 'changeset');
      changeset.set(field, value);
      this.propertyDidChange('changeset');
      this.sendAction('on-change', get(this, 'compositeChangeset'));
    },

    mergeSubChangeset({ id, changeset }) {
      let sections = get(this, SECTIONS);
      sections.set(id, changeset);
      this.propertyDidChange(SECTIONS);
    },

    _afterMergeSubChangeset({ id, changeset }) {
      let compositeChangeset = this.get('compositeChangeset');
      this.sendAction('on-change', compositeChangeset);
    },

    inputDidBlur(/* field, value */) {
    },

    inputDidFocus(/* field, value */) {
    },

    rollback() {
      let changeset = get(this, 'changeset');
      return changeset.rollback();
    },

    submitForm() {
      let compositeChangeset = get(this, 'compositeChangeset');

      if (isFunction(this.getAttr('on-submit'))) {
        let result = this.getAttr('on-submit')(compositeChangeset);
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
