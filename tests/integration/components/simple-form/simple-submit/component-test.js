import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('simple-form/simple-submit', 'Integration | Component | simple form/simple submit', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`
    {{#simple-form as |f|}}
      {{f.submit "Save Changes"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('form button').length, 1, 'it renders a <button> control');
});

test('it disables the submit button on submit', function(assert) {
  assert.expect(3);

  let resolveHandler;

  this.on('slowSubmitHandler', function() {
    return new Ember.RSVP.Promise((resolve) => resolveHandler = resolve).then((val) => console.log(val));
  });

  this.render(hbs`
    {{#simple-form on-submit=(action "slowSubmitHandler") as |f|}}
      {{f.submit "Save Changes"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('form button').attr('disabled'), undefined, 'button is not disabled');
  this.$('form button').click();
  assert.equal(this.$('form button').attr('disabled'), 'disabled', 'button is disabled');
  Ember.run(() => {
    resolveHandler(true);
  });

  Ember.run.next(() => {
    assert.equal(this.$('form button').attr('disabled'), undefined, 'button is not disabled');
  });
});
