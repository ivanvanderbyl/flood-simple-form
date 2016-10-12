import Ember from 'ember';
import Controller from 'ember-controller';

import {
  validatePresence,
  validateLength,
  validateFormat,
  validateInclusion
} from 'ember-changeset-validations/validators';

const UserValidations = {
  email: [
    validatePresence(true),
    validateFormat('email')
  ],
  number: [
    validatePresence(true),
    validateLength({ min: 8, max: 12 })
  ]
};

const PersonDetailValidations = {
  country: [
    validatePresence(true),
    validateInclusion({ list: ['au', 'de'] })
  ],
  isAdmin: [
    validateInclusion({ list: [true] })
  ],
  email: [
    validatePresence(true),
    validateFormat('email')
  ]
};

const AddressValidations = {
  street: [validatePresence(true)]
};

export default Controller.extend({
  UserValidations,
  PersonDetailValidations,
  AddressValidations,

  actions: {
    handleFormSubmit(changeset) {
      console.log(changeset.get('change'));
    }
  }
});
