import Ember from 'ember';
import layout from './template';
import Component from 'ember-component';
import MergeSupport, { SECTIONS, CHANGE_ACTION, REMOVE_ACTION } from 'flood-simple-form/mixins/merge-support';
import Changeset from 'ember-changeset';
const { guidFor, getWithDefault, set, get, observer, run } = Ember;

const SectionComponent = Component.extend(MergeSupport, {
  layout,
  tagName: 'div',
  classNames: ['SimpleForm-section'],

  changeset: null,

  isEnabled: false,

  form: null,

  /**
   * Called before this section is disabled
   * @public
   */
  sectionWillDisable() {
    let changeset = get(this, 'changeset');
    changeset.rollback();
    this.sendAction(REMOVE_ACTION, { id: guidFor(changeset) });
  },

  willDestroyElement() {
    this.trigger('sectionWillDisable');
  },

  actions: {
    propagateEnter() {
      this.sendAction('enter', ...arguments);
    },

    propagateCancel() {
      this.sendAction('cancel', ...arguments);
    }

  }
});

SectionComponent.reopenClass({
  positionalParams: ['changeset', 'isEnabled']
});

export default SectionComponent;
