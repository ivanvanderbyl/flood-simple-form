import Ember from 'ember';
import computed from 'ember-computed';
const { get, Mixin, guidFor, assert, isPresent } = Ember;

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
    //
    this[SECTIONS] = new Map();
    this._super();
  },

  compositeChangeset: computed('changeset', SECTIONS, {
    get() {
      let masterChangeset = get(this, 'changeset');
      assert('section must have a changeset', isPresent(masterChangeset));
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
    inputValueChanged(field, value) {
      let sectionChangeset = get(this, 'changeset');
      sectionChangeset.set(field, value);
      this.propertyDidChange('changeset');

      let changesetId = get(this, 'changesetId');
      let compositeChangeset = get(this, 'compositeChangeset');
      this.sendAction(CHANGE_ACTION, { changeset: compositeChangeset, id: changesetId });
    },

    mergeSubChangeset({ id, changeset }) {
      let sections = get(this, SECTIONS);
      sections.set(id, changeset);
      this.propertyDidChange(SECTIONS);

      let compositeChangeset = this.get('compositeChangeset');
      let changesetId = get(this, 'changesetId');
      this.sendAction(CHANGE_ACTION, { id: changesetId, changeset: compositeChangeset });
    },

    removeSubChangeset({ id }) {
      let sections = get(this, SECTIONS);
      if (sections.has(id)) {
        sections.get(id).rollback();
        sections.delete(id);
        this.propertyDidChange(SECTIONS);

        let compositeChangeset = this.get('compositeChangeset');
        let changesetId = get(this, 'changesetId');
        this.sendAction(CHANGE_ACTION, { id: changesetId, changeset: compositeChangeset });
      }
    }
  }
});
