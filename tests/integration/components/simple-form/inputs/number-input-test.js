import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/number-input', 'Integration | Component | simple form/inputs/number input', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#simple-form as |f|}}
      {{f.input "password" type="number"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('input').attr('type'), 'number', 'it renders as a number input');
});
