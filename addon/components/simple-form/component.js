import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
import isPromise from 'flood-simple-form/utils/is-promise';
import MergeSupport from 'flood-simple-form/mixins/merge-support';
const { get, typeOf } = Ember;

function isFunction(thing) {
  return typeOf(thing) === 'function';
}

const SECTIONS = '_sections';

const SimpleFormComponent = Component.extend(MergeSupport, {
  layout,

  tagName: 'div',
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
  changes: computed.reads('compositeChangeset.changes'),

  isValid: computed.empty('errors'),
  isInvalid: computed.not('isValid'),

  submit(event) {
    event.preventDefault();
    this.send('submitForm');
  },

  actions: {
    // TODO: Rename these actions to something form specific
    inputValueChanged(field, value) {
      let changeset = get(this, 'changeset');
      changeset.set(field, value);
      this.propertyDidChange('changeset');
    },

    // TODO: Rename these actions to something form specific
    mergeSubChangeset({ id, changeset }) {
      let sections = get(this, SECTIONS);
      sections.set(id, changeset);
      this.propertyDidChange(SECTIONS);
      this.sendAction('on-change', get(this, 'compositeChangeset'));
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
