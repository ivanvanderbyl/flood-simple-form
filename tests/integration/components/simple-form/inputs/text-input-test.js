import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/text-input', 'Integration | Component | simple form/inputs/text-input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('user', {
    email: null
  });

  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.input "email" placeholder="Email" label="Email Address"}}
      {{f.input "email" placeholder="Email" label="Email Address" disabled=true classNames="custom-class"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.email input').attr('type'), 'text', 'it renders as a text input by default');
  assert.equal(this.$('.email input').attr('placeholder'), 'Email', 'it renders placeholder attr');
  assert.equal(this.$('.email:first label').text(), 'Email Address', 'it renders label');
  assert.equal(this.$('.custom-class input').attr('disabled'), 'disabled', 'it renders as a text input in disabled state');
});
