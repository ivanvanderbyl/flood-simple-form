# flood-simple-form

The DDAU (Data Down, Actions Up) form builder we use at Flood IO. It's based on a lot of great work by others in the Ember community, but we felt we wanted to build something more flexible slightly less opinionated about how we persist our data.

The basic design behind this is that it shouldn't make any assumptions about your model or validations, and changes should be buffered until your form data is valid. This is achieved using `ember-buffered-proxy`. 

The inputs themselves are all DDAU. When a change occurs it fires an action which propagates that change up to the form component, ~~which in turn asks the model if its valid. If it isn't, an error message is shown, and if it is, you can apply these changes to your model. TBD.~~

## Form lifecycle

`flood-simple-form` is implemented with certain life cycle behaviours, designed to provide a consistent user experience.

Initially, all form inputs are supplied with initial values, which are not mutated when fields change.

_Assuming `userModel` has an `email` property:_

```hbs
{{#simple-form userModel as |f|}}
  {{f.input "email" placeholder="user@example.com" label="Email Address"}}
{{/simple-form}}
```

When inputs change, we automatically buffer the changes internally using `ember-buffered-proxy`. When pressing submit, the buffered changes are sent as the first parameter to the `on-submit` action.

```hbs
{{#simple-form userModel on-submit=(action "saveChanges") as |f|}}
  ...
{{/simple-form}}
```

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
- ~~`on-change`: Fires when any form value changes. The first parameter sent to the action handler is an object containing only the changed attributes.~~

## Form Controls

Type | HTML form | Additional attributes
--- | --- | ---
`boolean` | `<input type="checkbox" />` | None
`collection` | `<select>` | `multiple=<boolean>`
`date` | `<input type="date" />` |
`email` | `<input type="email" />`| 
`number` | `<input type="number" />`| 
`password` | `<input type="password" />`| 
`checkboxes` | collection of `<input type="radio" />` with labels | 
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

~~Error messages are rendered above hints, and an `invalid` class is added to the input container.~~

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
