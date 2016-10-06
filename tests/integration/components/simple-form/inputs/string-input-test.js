import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/string-input', 'Integration | Component | simple form/inputs/string input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('post', {
    email: null
  });

  this.render(hbs`
    {{#simple-form (changeset post) as |f|}}
      {{f.input "email" placeholder="Email" label="Email Address" type="string"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.email input').attr('type'), 'text', 'it renders as a text input');
});
