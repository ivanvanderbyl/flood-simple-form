import StringInputComponent from './string-input';
import computed from 'ember-computed';

export default StringInputComponent.extend({
  type: 'checkbox',

  checked: computed.reads('value')
});
