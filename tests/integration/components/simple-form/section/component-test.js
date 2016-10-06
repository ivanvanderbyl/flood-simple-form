import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  validatePresence,
  validateLength,
  validateFormat,
  validateInclusion,
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

const { run } = Ember;

moduleForComponent('simple-form/section', 'Integration | Component | simple form/section', {
  integration: true,
  beforeEach() {
    this.setProperties({ PersonDetailValidations,UserValidations });
    this.set('countries', [
      { id: 'au', name: 'Australia' },
      { id: 'us', name: 'United States' },
      { id: 'nz', name: 'New Zealand' }
    ]);

    this.set('user', {
      country: 'au',
      collectCountry: false
    });
  }
});

test('it renders a section', function(assert) {

  this.render(hbs`
    {{#simple-form (changeset user UserValidations) as |f changeset|}}
      {{f.input "collectCountry" type="boolean" label="Country?"}}
      {{#f.section (changeset user PersonDetailValidations) isEnabled=changeset.collectCountry as |f changeset|}}
        {{f.input "country" type="select" placeholder="Country..." label="Country" collection=countries optionValuePath="id" optionLabelPath="name"}}
      {{/f.section}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.collect-country').length, 1, 'it has the collect country boolean');
  assert.equal(this.$('.country select').length, 0, 'it does not show the select country dropdown');

  // Change the checkbox value
  run(() => this.$('.collect-country input[type="checkbox"]').trigger('click'));

  run(() => assert.equal(this.$('.country').length, 1, 'it shows the select country dropdown'));
});
