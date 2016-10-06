import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/tel-input', 'Integration | Component | simple form/inputs/tel input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('user', {
    contactNumber: null
  });

  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.input "contactNumber" type="tel" placeholder="(•••) ••• ••••" label="Phone Number" hint="Your Phone Number"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.contact-number p.SimpleForm-hint').text().trim(), 'Your Phone Number', 'it renders a hint');
  assert.equal(this.$('.contact-number input').attr('type'), 'tel', 'it renders as a tel input');
  assert.equal(this.$('.contact-number input').attr('placeholder'), '(•••) ••• ••••', 'it renders placeholder attr');
});
