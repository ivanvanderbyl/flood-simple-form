import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/boolean-input', 'Integration | Component | simple form/inputs/boolean-input', {
  integration: true
});

test('it renders', function(assert) {
  this.set('post', {
    isPublished: false,
  });

  this.render(hbs`
    {{#simple-form post as |f|}}
      {{f.input "isPublished" type="boolean"}}
    {{/simple-form}}
  `);

  assert.equal(this.$('.is-published input').attr('type'), 'checkbox', 'it renders as a checkbox input');
  assert.equal(this.$('.is-published input').prop('checked'), false, 'defaults to not checked');

  this.set('post', {
    isPublished: true,
  });

  assert.equal(this.$('.is-published input').prop('checked'), true, 'it renders as checked');
});

test('it correctly applies change events', function(assert) {
  assert.expect(1);

  this.set('post', {
    isPublished: false,
  });

  this.on('saveChanges', function(newPostAttrs) {
    assert.equal(newPostAttrs.isPublished, true, 'isPublished=true');
  });

  this.render(hbs`
    {{#simple-form post on-submit=(action "saveChanges") as |f|}}
      {{f.input "isPublished" type="boolean"}}
    {{/simple-form}}
  `);

  this.$('input').trigger('click');
  this.$('form').submit();
});
