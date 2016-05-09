import Ember from 'ember';
import computed from 'ember-computed';
import { validator, buildValidations } from 'ember-cp-validations';
import formBufferProperty from 'ember-validated-form-buffer';

const Validations = buildValidations({
  email: validator('presence', true),
  number: {
    description: 'Phone number',
    validators: [
      validator('presence', true),
      validator('length', {
        min: 10,
        max: 12,
      }),
    ]
  },
  country: validator('presence', true),
});

export default Ember.Controller.extend({

  data: formBufferProperty('user', Validations, {
    errors: computed.alias('displayErrors'),
  }),

  user: {
    email: 'user@example.com',
    number: '',
    country: {id: 'au', name: 'Australia'}
  },

  countries: [
    {id: 'au', name: 'Australia'},
    {id: 'us', name: 'United States'},
    {id: 'nz', name: 'New Zealand'},
  ],

  actions: {
    saveChanges(newData) {
      return new Ember.RSVP.Promise((resolve) => {
        setTimeout(() => {
          Ember.setProperties(this.get('user'), newData);
          this.propertyDidChange('user');
          resolve();
        }, 1e3);
      });
    },

    validateUser(attr, value) {
      this.get('data').set(attr, value);
    }
  }
});
