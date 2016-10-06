import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/email-input', 'Integration | Component | simple form/inputs/email input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('post', {
    email: null
  });

  this.render(hbs`
    {{#simple-form (changeset post) as |f|}}
      {{f.input "email" type="email"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.email input').attr('type'), 'email', 'it renders as an email input');
});
