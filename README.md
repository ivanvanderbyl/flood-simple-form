# flood-simple-form

The DDAU (Data Down, Actions Up) form builder we use at [Flood IO](https://flood.io). It's based on a lot of great work by others in the Ember community, but we felt we wanted to build something more flexible slightly less opinionated about how we persist our data.

The basic design behind this is that it shouldn't make any assumptions about your model or validations, and changes should be buffered until your form data is valid. This is achieved using `ember-buffered-proxy`. 

The inputs themselves are all DD,AU. When a change occurs it fires an action which propagates that change up to the form component, which buffers the changes internall, but also exposes them through a special validation hook, so that you can check the validity of the model using whichever validation addon you prefer.

[![Build Status](https://travis-ci.org/ivanvanderbyl/flood-simple-form.svg?branch=master)](https://travis-ci.org/ivanvanderbyl/flood-simple-form)

## Form lifecycle

`flood-simple-form` is implemented with certain life cycle behaviours, designed to provide a consistent user experience.

Initially, all form inputs are supplied with initial values, which are not mutated when fields change.

_Assuming `userModel` has an `email` property:_

```hbs
{{#simple-form userModel as |f|}}
  {{f.input "email" placeholder="user@example.com" label="Email Address"}}
{{/simple-form}}
```

When inputs change, we automatically buffer the changes internally using `ember-buffered-proxy`. 
When pressing submit, the buffered changes are sent as the first parameter to the `on-submit` action.

```hbs
{{#simple-form userModel on-submit=(action "saveChanges") as |f|}}
  ...
{{/simple-form}}
```

If the `userModel` contains an `errors` property, containing an object with errors for each input key, it will automatically display the error messages below the input for that key. There is also an action you can respond to specifically for validating inputs, which will behave in a slightly more useful way than the standard `on-change` action. For example, it won't run the initial validation until the input blurs, but it will run validations on change while the input has focus after it has changed (been dirtied).

If the action handling `on-submit` returns a promise, the form will disable all inputs while the promise resolves, re-enabling everything regardless of the outcome of the promise. This is useful to ensure a form is only submitted once, and ensuring consistency while changes are persisted.

```js
export default Ember.Controller.extend({
  actions: {
    saveChanges(changedAttrs) {
      this.get('user').setProperties(changedAttrs)
      return this.get('user').save();
    }
  }
});
```

## Installation

    ember install flood-simple-form

Requires **Ember 2.4+**.

## Usage

```hbs
{{#simple-form 
  initialValues=(hash 
    email="ivan@example.com"
    country="au"
  )
  on-submit=(action "createUser") as |f|}}

  {{f.input "email" placeholder="user@example.com" label="Email Address"}}
  {{f.input "fullName" placeholder="John Smith" label="Full Name"}}
  {{f.input "country" label="Country" as="collection" collection=countries labelPath="name" valuePath="isoCode"}}
  
  {{f.submit "Create User"}}
{{/simple-form}}
```

### `simple-form`

This is the main `<form>` constructor. It accepts an initial form values object/model to populate each form field. 
This is the initial value per form submission cycle, as mentioned in the lifecycle section above.

#### Actions

- `on-submit`: Fires when form is submitted, either by submit button or other enter key press. The first parameter sent to the action handler is an object containing only the changed attributes.
- `on-change`: Fires when any form value changes. The supplied paramters are the `attr` which changed, and its current `value`.
- `on-validate`: Similar to `on-change`, except only fires based on the validation life-cycle.

## Form Controls

Type | HTML form | Additional attributes
--- | --- | ---
`boolean` | `<input type="checkbox" />` | `isInputFirst:<boolean>` indicates whether the input comes before the label.
`collection` | `<select>` | `multiple=<boolean>` indicates whether the input should be rendered as a list with multiple selection.
`date` | `<input type="date" />` |
`email` | `<input type="email" />`| 
`number` | `<input type="number" />`| 
`password` | `<input type="password" />`| 
~~`checkboxes`~~ | ~~TBD collection of `<input type="radio" />` with labels~~ |
`string` | `<input type="text" />`| 
`text` | `<textarea>` | 

Each form input renders the following markup:

```html
<div class="ember-view SimpleForm-input email">
  <label for="ember431-input">Email Address</label>
  <div class="SimpleForm-field">
    <input id="ember431-input" placeholder="user@example.com" type="text" class="ember-view ember-text-field">
    <p class="SimpleForm-hint">Your email address</p>
  </div>
</div>
```

Error messages are rendered above hints, and an `invalid` class is added to the input container.

## Working with validations

__Please refer to the dummy app for a complete implementation of validations__

`flood-simple-form` will automatically display any errors which are present on your data model's `errors` attribute, as long as they conform to a standard format similar to `DS.Errors`, where the errors object contains a key for each attribute which has messages, with the value as an array of messages. e.g.

```js
const User = Ember.Object.extend({
  email: null,

  errors: {
    email: ["can't be blank", "must look like an email address"],
  }
});
```

## Custom Form Controls

`flood-simple-form` is flexible enough to allow custom form components, as long as they behave like all others.

To load a custom component, put it in `app/components/simple-form/inputs/custom-input.js`. You can then use it by specifying the `type` attribute as `custom`:

```hbs
{{f.input "creditCard" type="custom" placeholder="This will be sent as an attribute to custom-input"}}
```

Any additional attributes you set on input will be passed down to your custom component.

In order for your component to supply changes back up to the form, it must send an `on-change` action when there are changes, with the new value as the first parameter.

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
