import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/number-input', 'Integration | Component | simple form/inputs/number input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('post', {
    numberOfPeople: 0
  });

  this.render(hbs`
    {{#simple-form (changeset post) as |f|}}
      {{f.input "numberOfPeople" type="number"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('input').attr('type'), 'number', 'it renders as a number input');
});
