import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/password-input', 'Integration | Component | simple form/inputs/password input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('user', {
    password: null
  });

  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.input "password" type="password"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.password input').attr('type'), 'password', 'it renders as a password input');
});
