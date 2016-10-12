import Ember from 'ember';
import Changeset from 'ember-changeset';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
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

const { run } = Ember;

const TEMPLATE = hbs`
  {{#simple-form (changeset user UserValidations) on-submit=(action "handleFormSubmit") as |f changeset|}}
    {{f.input "collectSection1" type="boolean" label="Section 1"}}
    {{#if changeset.collectSection1}}
      {{#f.section (changeset user PersonDetailValidations) as |f changeset|}}
        {{f.input "fullName" label="Full name"}}
        {{f.input "collectSection2" type="boolean" label="Section 2"}}

        {{#if changeset.collectSection2}}
          {{#f.section (changeset user AddressValidations) as |f changeset|}}
            {{f.input "street" label="Street"}}
          {{/f.section}}
        {{/if}}

        {{f.input "collectSection2Additional" type="boolean" label="Section 2"}}
        {{#if changeset.collectSection2Additional}}
          {{#f.section (changeset user AddressValidations) isNeeded=needsSection2 as |f changeset|}}
            {{f.input "streetAdditional" label="Street (Line 2)"}}
          {{/f.section}}
        {{/if}}

      {{/f.section}}
    {{/if}}

    {{f.submit "Save"}}
  {{/simple-form}}
`;

moduleForComponent('simple-form/section', 'Integration | Component | simple form/section', {
  integration: true,
  beforeEach() {
    this.setProperties({ PersonDetailValidations, UserValidations });
    this.set('countries', [
      { id: 'au', name: 'Australia' },
      { id: 'us', name: 'United States' },
      { id: 'nz', name: 'New Zealand' }
    ]);

    this.set('user', {
      country: 'au',
      collectCountry: false
    });

    this.set('needsSection2', false);
  }
});

test('it renders a section', function(assert) {
  this.render(hbs`
    {{#simple-form (changeset user UserValidations) as |f changeset|}}
      {{f.input "collectCountry" type="boolean" label="Country?"}}
      {{#if changeset.collectCountry}}
        {{#f.section (changeset user PersonDetailValidations) as |f changeset|}}
          {{f.input "country" type="select" placeholder="Country..." label="Country" collection=countries optionValuePath="id" optionLabelPath="name"}}
        {{/f.section}}
      {{/if}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.collect-country').length, 1, 'it has the collect country boolean');
  assert.equal(this.$('.country select').length, 0, 'it does not show the select country dropdown');

  // Change the checkbox value
  run(() => this.$('.collect-country input[type="checkbox"]').trigger('click'));

  run(() => assert.equal(this.$('.country').length, 1, 'it shows the select country dropdown'));
});

test('it supports nested sections', function(assert) {
  let submitCount = 0;

  this.set('user', {
    collectSection1: false,
    collectSection2: false
  });

  this.on('handleFormSubmit', function(changeset) {
    submitCount++;

    if (submitCount === 2) {
      assert.deepEqual(changeset.get('change'), { 'collectSection1': false }, 'should only contain top level changeset');
    } else if (submitCount === 3) {
      assert.deepEqual(changeset.get('change'), { collectSection1: true }, 'should collect section 1 without any attrs');
    }
  });

  this.set('masterChangeset', new Changeset(this.get('user', UserValidations)));

  this.render(TEMPLATE);

  // 1. Open all sections and fill in street name
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.street input').val('Larnook Street').change());
  run(() => this.$('button').click());

  // 2. Assert fields are showing
  run(() => {
    assert.equal(this.$('.full-name').length, 1, 'is showing section 1');
    assert.equal(this.$('.street').length, 1, 'is showing address');
  });

  // 3. Close first section, thus removing nested section
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('button').click());

  // 4. Assert not showing sections
  run(() => {
    assert.equal(this.$('.full-name').length, 0, 'is showing section 1');
    assert.equal(this.$('.street').length, 0, 'is showing address');
  });

  // 5. Enable section again
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('button').click());

});

test('multiple nested sections', function(assert) {
  let submitCount = 0;
  this.set('user', {});
  assert.expect(5);

  this.on('handleFormSubmit', function(changeset) {
    submitCount++;
    let changes = changeset.get('change');

    if (submitCount === 1) {
      assert.equal(changes.fullName, 'John Smith', 'sets full name');
      assert.equal(changes.street, 'Larnook Street', 'sets street');
      assert.equal(changes.streetAdditional, 'Unit 1', 'sets street additonal');
    } else if (submitCount === 2) {
      assert.deepEqual(changes, {
        'collectSection1': true,
        'collectSection2': false,
        'collectSection2Additional': false,
        'fullName': 'John Smith'
      }, 'only contains section 1 keys');
    } else if (submitCount === 3) {
      assert.deepEqual(changes, { 'collectSection1': false }, 'only contains form keys');
    }
  });

  this.render(TEMPLATE);

  // 1. Open all sections and fill in street name
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2-additional input[type="checkbox"]').trigger('click').change());

  run(() => this.$('.full-name input').val('John Smith').change());
  run(() => this.$('.street input').val('Larnook Street').change());
  run(() => this.$('.street-additional input').val('Unit 1').change());
  run(() => this.$('button').click());

  // 2. Disable 2nd level sections and their details should not be present
  run(() => this.$('.collect-section2 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2-additional input[type="checkbox"]').trigger('click').change());
  run(() => this.$('button').click());

  // 3. No fields
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('button').click());
});

test('it supports being enabled while removed from DOM', function(assert) {
  this.set('user', {});
  this.set('needsSection2', true);

  this.on('handleFormSubmit', function(changeset) {
    assert.deepEqual(changeset.get('change'),
      {
        'collectSection1': true,
        'collectSection2': false,
        'collectSection2Additional': false,
        'fullName': 'John Smith',
        'streetAdditional': 'Unit 1'
      }, 'only contains second section');

  });

  this.render(TEMPLATE);

  // 1. Open all sections and fill in street name
  run(() => this.$('.collect-section1 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2-additional input[type="checkbox"]').trigger('click').change());

  run(() => this.$('.full-name input').val('John Smith').change());
  run(() => this.$('.street input').val('Larnook Street').change());
  run(() => this.$('.street-additional input').val('Unit 1').change());

  run(() => this.$('.collect-section2 input[type="checkbox"]').trigger('click').change());
  run(() => this.$('.collect-section2-additional input[type="checkbox"]').trigger('click').change());
  run(() => this.$('button').click());
});
