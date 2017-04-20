import Controller from 'ember-controller';
import Ember from 'ember';
import {
  validatePresence
} from 'ember-changeset-validations/validators';

const UserValidations = {
  // email: [
  //   validatePresence(true),
  //   validateFormat('email')
  // ],
  // number: [
  //   validatePresence(true),
  //   validateLength({ min: 8, max: 12 })
  // ]
};

const PersonDetailValidations = {
  fullName: [validatePresence(true)]
  // country: [
  //   validatePresence(true),
  //   validateInclusion({ list: ['au', 'de'] })
  // ],
  // isAdmin: [
  //   validateInclusion({ list: [true] })
  // ],
  // email: [
  //   validatePresence(true),
  //   validateFormat('email')
  // ]
};

const AddressValidations = {
  street: [validatePresence(true)],
  streetAdditional: [validatePresence(true)]
};

const { RSVP, Logger } = Ember;

export default Controller.extend({
  UserValidations,
  PersonDetailValidations,
  AddressValidations,

  actions: {
    fullNameChanged(/* changeset*/) {
    },

    handleFormSubmit(changeset) {
      return changeset.validate().then(() => {
        if (changeset.get('isValid')) {
          // changeset.execute();
          // Logger.log(this.get('user'));

          Logger.log(changeset.get('changes'));

          return new RSVP.Promise((resolve) => setTimeout(resolve.bind(this, true), 1e3));
        } else {
          Logger.log('invalid');
          return true;
        }
      });
    }
  }
});
