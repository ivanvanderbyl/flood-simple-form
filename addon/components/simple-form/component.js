import Ember from 'ember';
import Component from 'ember-component';
import layout from './template';
import BufferedProxy from 'ember-buffered-proxy/proxy';

const { computed } = Ember;

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
   * Initial form values to apply to each input
   *
   * @type {Object}
   */
  initialValues: {},

  formValues: null,

  didReceiveAttrs() {
    this._super(...arguments);
    let initialValues = this.getAttr('initialValues') || {};
    let formValues = BufferedProxy.create({content: initialValues});

    this.set('formValues', formValues);
  },

  submit(event) {
    event.preventDefault();

    const formData = this.get('formValues.buffer');
    formData.applyBufferedChanges();
    this.sendAction('on-submit', formData);
  },

  actions: {
    inputValueChanged(modelAttr, newValue) {
      this.get('formValues').set(modelAttr, newValue);
    },

    submitForm() {
      const formData = this.get('formValues.buffer');
      // formData.applyBufferedChanges();

      if (isFunction(this.getAttr('on-submit'))) {
        let result = this.getAttr('on-submit')(formData);
        if (result.finally) {
          this.set('disabled', true);
          result.finally(() => this.set('disabled', false));
        }
      }
    }
  }

});

SimpleFormComponent.reopenClass({
  positionalParams: ['initialValues'],
});

export default SimpleFormComponent;
