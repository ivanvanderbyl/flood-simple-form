import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import computed from 'ember-computed';
import isPromise from 'flood-simple-form/utils/is-promise';
const { get } = Ember;

function isFunction(thing) {
  return Ember.typeOf(thing) === 'function';
}

const SimpleFormComponent = Component.extend({
  layout,

  tagName: 'form',
  classNames: ['SimpleForm'],

  disabled: false,

  attributeBindings: ['disabled'],

  /**
   * Changeset to propagate changes to.
   *
   * @type {EmberChangeset}
   */
  changeset: null,

  errors: computed.reads('changeset.errors'),

  formValues: computed.reads('changeset'),

  submit(event) {
    event.preventDefault();
    this.send('submitForm');
  },

  actions: {
    inputValueChanged(field, value) {
      get(this, 'changeset').set(field, value);
      this.sendAction('on-change', get(this, 'changeset'));
    },

    rollback() {
      let changeset = get(this, 'changeset');
      return changeset.rollback();
    },

    submitForm() {
      let changeset = get(this, 'changeset');

      if (isFunction(this.getAttr('on-submit'))) {
        let result = this.getAttr('on-submit')(changeset);
        if (isPromise(result)) {
          this.set('disabled', true);
          result.then((shouldEnableForm) => {
            if (shouldEnableForm !== false) {
              this.set('disabled', false);
            }
          }, () => this.set('disabled', false));
        }
      }
    },
  },

});

SimpleFormComponent.reopenClass({
  positionalParams: ['changeset'],
});

export default SimpleFormComponent;
