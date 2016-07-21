import Ember from 'ember';
import lookupValidator from 'ember-changeset-validations';
import {
  validatePresence,
  validateLength,
  validateFormat,
  validateInclusion,
} from 'ember-changeset-validations/validators';

const UserValidations = {
  email: [
    validatePresence(true),
    validateFormat('email'),
  ],
  number: [
    validatePresence(true),
    validateLength({ min: 8, max: 12 }),
  ],
};

const PersonDetailValidations = {
  country: [
    validatePresence(true),
    validateInclusion({ list: ['au', 'de'] }),
  ],
  isAdmin: [
    validateInclusion({ list: [true] }),
  ],
  email: [
    validatePresence(true),
    validateFormat('email'),
  ],
};

export default Ember.Controller.extend({
  UserValidations,
  PersonDetailValidations,

  user: null,

  countries: [
    { id: 'au', name: 'Australia' },
    { id: 'us', name: 'United States' },
    { id: 'nz', name: 'New Zealand' },
    { id: 'de', name: 'Germany' },
  ],

  actions: {
    validate(options) {
      return lookupValidator(UserValidations)(options);
    },

    saveChanges(changeset) {
      return changeset
        .validate()
        .then(() => {
          if (changeset.get('isValid')) {
            changeset.execute();
            changeset.rollback();
            return new Ember.RSVP.Promise((resolve) => {
              setTimeout(() => resolve(), 1e3);
            });
          }
        });

    },

    validateUser(attr, value) {
      this.get('data').set(attr, value);
    },
  },
});
