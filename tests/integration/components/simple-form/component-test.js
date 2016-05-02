import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form', 'Integration | Component | simple form', {
  integration: true
});

test('it renders a form', function(assert) {
  this.render(hbs`
    {{#simple-form as |f|}}
      {{f.input "number" type="tel" placeholder="(•••) ••• ••••" label="Phone Number" hint="Your Phone Number"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.number p.SimpleForm-hint').text().trim(), 'Your Phone Number', 'it renders a hint');
});
