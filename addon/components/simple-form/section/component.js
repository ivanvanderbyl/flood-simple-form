import Ember from 'ember';
import layout from './template';
import Component from 'ember-component';
import MergeSupport, { REMOVE_ACTION } from 'flood-simple-form/mixins/merge-support';
const { guidFor, get, run } = Ember;

const SectionComponent = Component.extend(MergeSupport, {
  layout,
  tagName: 'div',
  classNames: ['SimpleForm-section'],

  changeset: null,

  form: null,

  /**
   * Indicates that we should keep this around even when not showing the section.
   *
   * @public
   * @type {Boolean}
   */
  isNeeded: false,

  /**
   * Called before this section is disabled
   * @public
   */
  sectionWillDisable() {
    let changeset = get(this, 'changeset');
    let isNeeded = get(this, 'isNeeded');

    if (!isNeeded) {
      changeset.rollback();
      this.sendAction(REMOVE_ACTION, { id: guidFor(changeset) });
    }
  },

  willDestroyElement() {
    this.trigger('sectionWillDisable');
  },

  didInsertElement() {
    run.next(() => {
      this.send('_sendUpdate');
    });
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
