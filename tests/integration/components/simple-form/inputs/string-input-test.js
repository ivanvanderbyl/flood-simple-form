import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/inputs/string-input', 'Integration | Component | simple form/inputs/string input', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-form/inputs/string-input}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#simple-form/inputs/string-input}}
      template block text
    {{/simple-form/inputs/string-input}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
