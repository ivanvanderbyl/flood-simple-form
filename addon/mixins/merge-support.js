import Ember from 'ember';
import computed from 'ember-computed';
const { observer, run, get, Mixin, guidFor, isPresent } = Ember;

/**
 * Merges 1 or more changesets together returning a fresh changeset
 * containing the changes and errors of all combined changesets.
 *
 * @param  {Changeset...} changesets
 * @public
 * @return {Changeset}
 */
export function compositeChangeset(...changesets) {
  let masterChangeset = changesets.shift();
  changesets.forEach((changeset) => masterChangeset = masterChangeset.merge(changeset));
  return masterChangeset;
}

export const SECTIONS = '_sections';
export const CHANGE_ACTION = '_change';
export const REMOVE_ACTION = '_remove';
export default Mixin.create({
  [SECTIONS]: null,

  title: null,

  init() {
    this[SECTIONS] = new Map();
    this._super();
  },

  changesetDidChange: observer('changeset._changes', 'changeset._errors', function() {
    let changeset = get(this, 'changeset');
    if (changeset.get('isDirty')) {
      this.send('_sendUpdate');
    }
  }),

  compositeChangeset: computed('changeset', SECTIONS, {
    get() {
      let masterChangeset = get(this, 'changeset');
      if (!isPresent(masterChangeset)) {
        return null;
      }

      return compositeChangeset(masterChangeset, ...this[SECTIONS].values());
    }
  }),

  changesetId: computed('changeset', {
    get() {
      return guidFor(get(this, 'changeset'));
    }
  }),

  change: computed.alias('compositeChangeset.change'),
  changes: computed.alias('compositeChangeset.changes'),
  error: computed.alias('compositeChangeset.error'),
  errors: computed.alias('compositeChangeset.errors'),

  actions: {
    /**
     * Handles changes from form inputs by field name and value, assigning the
     * result directly to this section's changeset.
     *
     * NOTE: There's no need to trigger an update here as we do so in the observer.
     *
     * @private
     */
    inputValueChanged(field, value) {
      let sectionChangeset = get(this, 'changeset');
      sectionChangeset.set(field, value);
      this.propertyDidChange('changeset');
      this.send('_sendUpdate');
    },

    /**
     * Handles changes from nested changesets, merging them with our own changeset,
     * then propagating the composite changeset to the parent section/form.
     *
     * @private
     */
    mergeSubChangeset({ id, changeset }) {
      let sections = get(this, SECTIONS);
      sections.set(id, changeset);
      this.propertyDidChange(SECTIONS);

      this.send('_sendUpdate');
    },

    removeSubChangeset({ id }) {
      let sections = get(this, SECTIONS);
      if (sections.has(id)) {
        sections.get(id).rollback();
        sections.delete(id);
        this.propertyDidChange(SECTIONS);
        this.send('_sendUpdate');
      }
    },

    _sendUpdate() {
      run.scheduleOnce('actions', this, function() {
        let changeset = this.get('changeset');
        if (!changeset) {
          return;
        }

        let compositeChangeset = this.get('compositeChangeset');
        let changesetId = get(this, 'changesetId');
        this.sendAction(CHANGE_ACTION, { id: changesetId, changeset: compositeChangeset });
      });
    }
  }
});
