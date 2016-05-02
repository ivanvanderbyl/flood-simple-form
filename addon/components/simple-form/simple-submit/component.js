import Component from 'ember-component';
import layout from './template';

const SubmitComponent = Component.extend({
  layout,
  tagName: 'button',

  label: 'Submit',

  disabled: false,

  /**
   * The <form> ID
   *
   * @type {String}
   */
  form: null,

  attributeBindings: ['form', 'disabled'],

  click(event) {
    event.preventDefault();
    this.sendAction('action');
  }
});

SubmitComponent.reopenClass({
  positionalParams: ['label'],
});

export default SubmitComponent;
