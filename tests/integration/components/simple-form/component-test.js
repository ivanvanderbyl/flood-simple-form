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

test('it propagates changes from initial data to form inputs', function(assert) {
  this.set('user', {
    number: '415 000 0000'
  });

  this.render(hbs`
    {{#simple-form user as |f|}}
      {{f.input "number" type="tel" placeholder="(•••) ••• ••••" label="Phone Number" hint="Your Phone Number"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.number input').val().trim(), '415 000 0000', 'it renders initial number');

  this.set('user', {
    number: 'N/A'
  });

  assert.equal(this.$('.number input').val().trim(), 'N/A', 'it renders updated number');
});

test('it emits change events when a field changes', function(assert) {
  assert.expect(2);

  this.on('handleInputValueChange', function(attr, value) {
    assert.equal(attr, 'email', 'email field changed');
    assert.equal(value, 'user@flood.io', 'email field changed');
  });

  this.render(hbs`
    {{#simple-form on-change=(action "handleInputValueChange") as |f|}}
      {{f.input "email" type="email"}}
    {{/simple-form}}
  `);

  this.$('.email input').val('user@flood.io').change();
});

test('inputs support blocks', function(assert) {

  this.render(hbs`
    {{#simple-form as |f|}}
      {{#f.input "email" type="block" as |input|}}
        <p class="yielded">{{input.someInternalPropertyOnInput}}</p>
      {{/f.input}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.yielded').text(), 'TEST', 'has yielded label');
  assert.equal(this.$('p.name').text(), 'Block Dummy Component', 'has component content');
});
