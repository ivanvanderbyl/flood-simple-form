import Ember from 'ember';
import layout from './template';
import Component from 'ember-component';
import MergeSupport, { REMOVE_ACTION } from 'flood-simple-form/mixins/merge-support';
import take from 'ember-changeset/utils/take';

const { isPresent, computed, guidFor, get, run, run: { scheduleOnce } } = Ember;

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

  knownAttrs: [],

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

  _getParentValueForAttr(attrs) {
    let parentChangeset = this.get('parentChangeset');
    if (!parentChangeset) {
      return null;
    }

    let { changes, errors } = parentChangeset.snapshot();
    let newChanges = take(changes, attrs);
    let newErrors = take(errors, attrs);
    return { changes: newChanges, errors: newErrors };
  },

  // didReceiveAttrs() {
  //   console.log(this.getAttr('changeset').get('change'));
  //   scheduleOnce('actions', this, function() {
  //     // console.log(this.get('snapshotForKnownAttrs'));
  //   });
  // },

  // snapshotForKnownAttrs: computed('knownAttrs.[]', {
  //   get() {
  //     let knownAttrs = get(this, 'knownAttrs');
  //     // console.log(knownAttrs);
  //   }
  // }),

  actions: {
    notifyInputInsert(attr) {
      let knownAttrs = get(this, 'knownAttrs');
      if (!knownAttrs.includes(attr) && isPresent(attr)) {
        knownAttrs.addObject(attr);
      }

      // let snapshot = this._getParentValueForAttr(attr);

      // if (snapshot) {
      //   console.log('snapshot', snapshot);
      //   let changeset = get(this, 'changeset');
      //   changeset.restore(snapshot);
      // }
    },

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
