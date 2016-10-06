import Ember from 'ember';

const { typeOf } = Ember;

function isPromiseLike(obj = {}) {
  return !!obj &&
    typeOf(obj.then) === 'function' &&
    typeOf(obj.catch) === 'function' &&
    typeOf(obj.finally) === 'function';
}

export default function isPromise(obj) {
  return isPromiseLike(obj);
}
