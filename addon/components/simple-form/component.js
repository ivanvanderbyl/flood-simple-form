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

  instrumentName: 'simple-form:form',

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

  isValid: computed.reads('compositeChangeset.isValid'),
  isInvalid: computed.reads('compositeChangeset.isInvalid'),
  isPristine: computed.reads('compositeChangeset.isPristine'),
  isDirty: computed.reads('compositeChangeset.isDirty'),

  submit(event) {
    event.preventDefault();
    this.send('submitForm');
  },

  // changesetDidChange: Ember.observer('changeset.change.name', function() {
  //   console.log(this.get('instrumentName'), this.get('changeset').get('change'));
  // }),

  didInsertElement() {
    this.sendAction('on-insert', get(this, 'changeset'));
  },

  didReceiveAttrs() {
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

      this.propertyDidChange('changeset');
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
