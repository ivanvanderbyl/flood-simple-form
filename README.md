# flood-simple-form

The DDAU (Data Down, Actions Up) form builder we use at [Flood IO](https://flood.io). It's based on a lot of great work by others in the Ember community, but we felt we needed something more flexible and slightly less opinionated about how data is persisted.

The basic principle behind this is to borrow a similar syntax to Simple Form from the Rails world, and apply an intermediate change layer using [`ember-changeset`](https://github.com/DockYard/ember-changeset).

The inputs themselves are all DD,AU. When a change occurs it fires an action which propagates that change up to the form component, where the value is assigned to the `changeset`, which also fires the validations so you get realtime feedback as fields change.

When the form is submitted, you can choose how you persist the changeset, but typically you would just call `changeset.save()`.

[![Build Status](https://travis-ci.org/ivanvanderbyl/flood-simple-form.svg?branch=master)](https://travis-ci.org/ivanvanderbyl/flood-simple-form)

## Form lifecycle

`flood-simple-form` is implemented with certain life cycle behaviours, designed to provide a consistent user experience.

To start, create a form and supply a `changeset` as the first argument. The underlying model can be an [`Ember.Object`, `DS.Model` or POJO](https://github.com/DockYard/ember-changeset#philosophy), and on submit all changes will be applied to this
object if the changeset is valid.

_Assuming `user` has an `email` property:_

```hbs
{{#simple-form (changeset user (action "validate") as |f|}}
  {{f.input "email" placeholder="user@example.com" label="Email Address"}}
{{/simple-form}}
```

`flood-simple-form` supports errors from `ember-changeset`, so you can easily propagate errors from the server and client side validations.

If the action handling `on-submit` returns a promise, the form will disable all inputs while the promise resolves, re-enabling everything regardless of the outcome of the promise. This is useful to ensure a form is only submitted once, and ensuring consistency while changes are persisted.

```js
export default Ember.Controller.extend({
  actions: {
    saveChanges(changeset) {
      return changeset.save();
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
  (changeset user (action "validate"))
  on-submit=(action "createUser") as |f|}}

  {{f.input "email" placeholder="user@example.com" label="Email Address"}}
  {{f.input "fullName" placeholder="John Smith" label="Full Name"}}
  {{f.input "country" label="Country" as="collection" collection=countries labelPath="name" valuePath="isoCode"}}
  
  {{f.submit "Create User"}}
{{/simple-form}}
```

```js
export default Controller.extend({
	actions: {
		validate({key, newValue}) {
			// Validation logic, must return `true` or an error message.
		},
		
		createUser(changeset) {
			return changeset.save().catch(() => {
				get(this, 'model.errors').forEach(({ attribute, message }) => {
					changeset.addError(attribute, { validation: message });
				});
			})
		}
	}
});
```

### `simple-form`

This is the main `<form>` constructor. It accepts an initial form values object/model to populate each form field. 
This is the initial value per form submission cycle, as mentioned in the lifecycle section above.

#### Actions

- `on-submit`: Fires when form is submitted, either by submit button or other enter key press. The first parameter sent to the action handler is an object containing only the changed attributes.
- `on-change`: Fires when any form value changes. The supplied paramters are the `attr` which changed, and its current `value`.

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
