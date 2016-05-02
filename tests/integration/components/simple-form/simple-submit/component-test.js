import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('simple-form/simple-submit', 'Integration | Component | simple form/simple submit', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{simple-form/simple-submit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#simple-form/simple-submit}}
      template block text
    {{/simple-form/simple-submit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
