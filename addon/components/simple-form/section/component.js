import Ember from 'ember';
import layout from './template';
import Component from 'ember-component';

const { get, set, observer } = Ember;

const SectionComponent = Component.extend({
  layout,
  tagName: '',

  changeset: null,

  isEnabled: true,

  form: null,

  isEnabledDidChange: observer('isEnabled', function () {
    let isEnabled = get(this, 'isEnabled');
    if (!isEnabled) {
      let changeset = get(this, 'changeset');
      changeset.rollback();
      this.sendAction('internal-invalidate-section', { id: this.elementId });
    }
  }),

  actions: {
    inputValueChanged(field, value) {
      let changeset = get(this, 'changeset');
      changeset.set(field, value);
      changeset.validate();

      this.propertyDidChange('changeset');
      this.sendAction('internal-on-change', { id: this.elementId, changeset });

      if (get(changeset, 'isValid')) {
        this.sendAction('internal-section-became-valid', { id: this.elementId, changeset });
      }
    },

    mergeSectionChangeset({ id, changeset }) {
      this.sendAction('internal-on-change', { id, changeset });
    },

    invalidateSection({ id }) {
      this.sendAction('internal-invalidate-section', { id });
    },

    propagateEnter() {
      this.sendAction('enter', ...arguments);
    },

    propagateCancel() {
      this.sendAction('cancel', ...arguments);
    },

  },
});

SectionComponent.reopenClass({
  positionalParams: ['changeset', 'isEnabled'],
});

export default SectionComponent;
