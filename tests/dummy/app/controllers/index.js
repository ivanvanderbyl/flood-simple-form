import Ember from 'ember';
import computed from 'ember-computed';
import {
  validatePresence,
  validateLength,
  validateFormat,
  validateInclusion,
} from 'ember-changeset-validations/validators';

const validations = {
  email: [
    validatePresence(true),
    validateFormat('email'),
  ],
  number: [
    validatePresence(true),
    validateLength({ min: 8, max: 12 }),
  ],
  country: validatePresence(true),
  isAdmin: [
    validateInclusion({ list: [true] }),
  ],
};

export default Ember.Controller.extend({
  user: {
    email: 'user@example.com',
    number: '',
    country: { id: 'au', name: 'Australia' },
    isAdmin: false,
  },

  countries: [
    { id: 'au', name: 'Australia' },
    { id: 'us', name: 'United States' },
    { id: 'nz', name: 'New Zealand' },
  ],

  actions: {
    validate({ key, newValue }) {
      let validationsForKey = validations[key];

      if (Ember.typeOf(validationsForKey) !== 'array') {
        validationsForKey = [validationsForKey];
      }

      let i = -1;
      let isValid = true;
      while (++i < validationsForKey.length && isValid === true) {
        let validatorFn = validationsForKey[i];
        if (Ember.typeOf(validatorFn) === 'function') {
          isValid = validatorFn(key, newValue);
        }else {
          isValid = true;
        }
      }

      return isValid;
    },

    saveChanges(newData) {
      return new Ember.RSVP.Promise((resolve) => {
        setTimeout(() => {
          Ember.setProperties(this.get('user'), newData);
          resolve();
        }, 1e3);
      });
    },

    validateUser(attr, value) {
      this.get('data').set(attr, value);
    },
  },
});
