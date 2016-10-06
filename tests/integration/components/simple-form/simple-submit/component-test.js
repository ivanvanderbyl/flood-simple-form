import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const { RSVP, run } = Ember;

moduleForComponent('simple-form/simple-submit', 'Integration | Component | simple form/simple submit', {
  integration: true
});

test('it renders', function(assert) {
  this.set('user', {});

  this.render(hbs`
    {{#simple-form (changeset user) as |f|}}
      {{f.submit "Save Changes"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('form button').length, 1, 'it renders a <button> control');
});

test('it disables the submit button on submit', function(assert) {
  this.set('user', {});

  assert.expect(4);

  let resolveHandler;

  this.on('slowSubmitHandler', function() {
    return new RSVP.Promise((resolve) => resolveHandler = resolve).then((val) => assert.ok(val, 'form submitted'));
  });

  this.render(hbs`
    {{#simple-form (changeset user) on-submit=(action "slowSubmitHandler") as |f|}}
      {{f.submit "Save Changes"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('form button').attr('disabled'), undefined, 'button is not disabled');
  this.$('form button').click();
  assert.equal(this.$('form button').attr('disabled'), 'disabled', 'button is disabled');
  run(() => {
    resolveHandler(true);
  });

  run.next(() => {
    assert.equal(this.$('form button').attr('disabled'), undefined, 'button is not disabled');
  });
});
