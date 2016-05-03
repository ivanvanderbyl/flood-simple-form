import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/date-input', 'Integration | Component | simple form/inputs/date-input', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#simple-form as |f|}}
      {{f.input "publishOn" type="date"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.publish-on input').attr('type'), 'date', 'it renders as a date input');
});
