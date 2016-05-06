# Ember Changelog

### 0.1.7 (May 06, 2016)

- [FEATURE] Added support for block components on inputs. Mainly to provide support for `ember-power-select`.

### 0.1.6 (May 05, 2016)

- [FEATURE] Form now supports `on-change` action, which is emitted any time a form field changes. The supplied parameters are `[<attr>, <value>]`.

### 0.1.5 (May 04, 2016)

- [BUGFIX] Select now returns the value of the selected option, instead of the option itself.

### 0.1.4 (May 04, 2016)

- [BUGFIX] `on-change` now fires with input value as first argument and doesn't override internal value propagation.

### 0.1.3 (May 03, 2016)

- [FEATURE] Added support for inline labels on checkboxes. If enabled, the input component is rendered before the label. This can be reversed with CSS or `isInputFirst=false`.

### 0.1.2 (May 03, 2016)

- [FEATURE] Added additional input types: `boolean`, `date`, `email`, `number`, `password`, `string`, `text`.

### 0.1.1 (May 03, 2016)

- [BUGFIX] Bug fix with development dependencies

### 0.1.0 (May 03, 2016)

- [FEATURE] Initial Release
