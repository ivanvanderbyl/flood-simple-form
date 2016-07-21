import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/section', 'Integration | Component | simple form/section', {
  integration: true,
  beforeEach: function () {
    this.set('countries', [
      { id: 'au', name: 'Australia' },
      { id: 'us', name: 'United States' },
      { id: 'nz', name: 'New Zealand' },
    ]);

    this.set('user', {
      country: 'au',
    });
  },
});

test('it renders a section', function (assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`
    {{#simple-form (changeset user UserValidations) as |f changeset|}}
      {{f.input "collectCountry" type="boolean" label="Country?"}}
      {{#f.section (changeset user PersonDetailValidations) isEnabled=changeset.collectCountry as |f changeset|}}
        {{f.input "country" type="select" placeholder="Country..." label="Country" collection=countries optionValuePath="id" optionLabelPath="name"}}
      {{/f.section}}
    {{/simple-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
