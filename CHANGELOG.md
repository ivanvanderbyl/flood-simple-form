# Flood Simple Form Changelog


### 0.2.3 (October 13, 2016)

- Changes to underlying changeset now propagate through parent changesets.

### 0.2.2 (October 12, 2016)

- Added `isNeeded` on sections to indicate that we need to keep it around even
  when a section is removed from the DOM. This only applies one level up, so you
  must indicate this at all nested levels with an equally truthy condition.

### 0.2.1 (October 12, 2016)

- Added support for nested sections
- Refactored to properly track changes in nested sections

### 0.2.0 (July 14, 2016)

- Removed support for buffer (breaking)
- Added support for Ember Changeset

### 0.1.10 (May 22, 2016)

- Fixed data flow issues which prevented simple-form-power-select working.

### 0.1.9 (May 12, 2016)

- Changed error format to be more consistent with `DS.Errors`. Now expects `[{attribute: "someAttribute", message: "validation message"}, ...]`.

### 0.1.8 (May 09, 2016)

- [#1](https://github.com/ivanvanderbyl/flood-simple-form/pull/1) Add support for `errors` on main model.

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
