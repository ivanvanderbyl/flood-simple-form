import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
const { run } = Ember;
moduleForComponent('simple-form/inputs/select-input', 'Integration | Component | simple form/inputs/select-input', {
  integration: true,

  beforeEach() {
    this.set('countries', [
      { id: 'au', name: 'Australia' },
      { id: 'us', name: 'United States' },
      { id: 'nz', name: 'New Zealand' }
    ]);

    this.set('user', {
      country: 'au'
    });
  }
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.input "country" type="select" placeholder="Country..." label="Where are you from?" collection=countries optionValuePath="id" optionLabelPath="name"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.country select').length, 1, 'it renders a <select> control');
  assert.equal(this.$('.country select option').length, 4, 'it renders select options');
  assert.equal(this.$('.country select option:first').text().trim(), 'Country...', 'it renders select option placeholder');
  assert.equal(this.$('.country select option:nth-child(2)').text().trim(), 'Australia', 'it renders in order');
});

test('it can pass in initial selection', function(assert) {
  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.input "country" type="select" placeholder="Country..." label="Where are you from?" collection=countries optionValuePath="id" optionLabelPath="name"}}
    {{/simple-form}}
  `);

  assert.expect(1);
  run.next(() => {
    assert.equal(this.$('.country option:selected').text().trim(), 'Australia', 'australia is selected');
  });
});

test('it sends changes to form', function(assert) {
  assert.expect(2);

  this.on('handleFormSubmit', function(changeset) {
    assert.deepEqual(changeset.get('country'), 'us', 'has selected united states');
  });

  this.render(hbs`
    {{#simple-form (changeset user) on-submit=(action "handleFormSubmit") as |f|}}
      {{f.input "country" type="select" placeholder="Country..." label="Where are you from?" collection=countries optionValuePath="id" optionLabelPath="name"}}
    {{/simple-form}}
  `);

  this.$('.country select').val('us').change();

  assert.equal(this.$('.country option:selected').text().trim(), 'United States', 'USA is selected');
  this.$('form').submit();
});
