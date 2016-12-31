# Fixture

[![Build Status](https://travis-ci.org/fixturejs/fixture.svg?branch=master)](https://travis-ci.org/fixturejs/fixture)
[![Coverage Status](https://img.shields.io/coveralls/fixturejs/fixture.svg)](https://coveralls.io/r/fixturejs/fixture)

A _fixture_ provides a consistent execution context and reproducible results. For this reason, they are often used in conjunction with [unit tests](http://en.wikipedia.org/wiki/Test_fixture). However, they have many other useful applications.


## Lifecycle

The lifecycle of a fixture is typically composed of these stages, some of which may be optional:

1. [attach](#attach) - Prepare the proper execution context needed to reliably use the fixture.
2. [interact](#interact) - Interact with the fixture.
3. [verify](#verify) - Determine if the outcome of interacting with the fixture was expected.
4. [detach](#detach) - Set the execution context back to its original state.


## Usage

The goal of this project is to set up a standard, lightweight API for the use of fixtures in JavaScript without enforcing a specific pattern of usage. This allows for flexibility, but leaves the burden of enforcement on the implementor.


## Installation

Fixture can be installed with [NPM](http://npmjs.org):

    npm install fixturejs

Or [Bower](http://bower.io):

    bower install fixture

Or downloaded in the following formats:

* [fixture.js](https://raw.githubusercontent.com/fixturejs/fixture/master/dist/fixture.js) (latest uncompressed, development version)
* [fixture.min.js](https://raw.githubusercontent.com/fixturejs/fixture/master/dist/fixture.min.js) (latest compressed, production version)

For older versions, see [releases](https://github.com/fixturejs/fixture/releases).


## API

The following methods are exposed publically, either through the `Fixture` Object in browser environments, or by requiring `fixtures.js` as an [asynchronous module](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).


### Constructor

```javascript
var fixture = new Fixture();
```

Note that use of the `new` operator is optional.


### Constructor Parameters


#### settings

A hash of key/value pairs used to configure the fixture instance. Keys should match the standard methods and properties listed below, although non-standard key/value pairs can also be mixed in. See the section below for default values.


### Instance Methods

The following instance methods are available on all fixture instances.


#### attach()

Prepares the proper execution context needed to reliably use the fixture. Generally, anything modified at this time will be undone during detachment. Default value is [NOP](http://en.wikipedia.org/wiki/NOP).


#### detach()

Sets the execution context back to its original state. Generally, anything modified during attachment should be undone at this time. Default value is [NOP](http://en.wikipedia.org/wiki/NOP).


#### equals( _other_ ) => _Boolean_

Returns whether or not the instance is equal to another `Fixture`. By default, [Fixture.equal()](#fixtureequal-first-second---boolean) will be used to determine equality.

* **other** (_Fixture_)  
  The `Fixture` to compare against.


#### interact()

Interact with the fixture. The outcome of use should be consistently reproducible. Default value is [NOP](http://en.wikipedia.org/wiki/NOP).


#### toString() => _String_

Returns the String representation of a fixture. By default, "Fixture:_[UUID](#uuid--string--number)_".


#### verify()

Determine if the outcome of interacting with the fixture was expected. Default value is [NOP](http://en.wikipedia.org/wiki/NOP).


### Instance Properties

The following instance properties are available on all fixture instances.


#### data => _Object_

An arbitrary hash of key/value pairs to associate with the fixture. An empty Object by default.


#### uuid => _String_ | _Number_

The fixture's [Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier). By default, an internally incremented Integer will be used.


### Static Methods

The following static methods are available on the `Fixture` Object.


#### Fixture.create( _value_ ) => _Fixture_

A `Fixture` factory method which takes advantage of [normalization](#normalization) to allow defining fixtures in various ways. If normalization fails, this method will return `undefined`.

* **value** (_Fixture_ | _Function_ | _Object_ | _String_)  
  A value that will be [normalized](#normalization) into the settings used to create a `Fixture`.


#### Fixture.define( [ _name_, ] _definition_ [, _force_ ] ) => _Fixture_

Creates a [fixture definition](#definitions). All fixture definitions will be normalized before they are stored.

* **name** (_String_)  
  The name of the definition.

* **definition** (_Fixture_ | _Function_ | _Object_ | _String_)  
  The Object from which to create the definition. If the `name` parameter is not provided, this must be an Object with a defined `name` key.

* **force** (_Boolean_)  
  Whether to allow the fixture definition to overwrite existing keys in storage. Defaults to `false`.


#### Fixture.equal( _first_, _second_ ) => _Boolean_

Determines if two fixtures are equal by comparing their _[UUID](#uuid--string--number)s_. Fails if either value is not a `Fixture` or if the _UUIDs_ are not [strictly equal](http://ecma-international.org/ecma-262/5.1/#sec-11.9.6).

* **first** (_Fixture_)  
  The value used as a basis of comparison.

* **second** (_Fixture_)  
  The value to be compared against the first.


#### Fixture.get( _name_[, _settings_] ) => _Object_


Get a [fixture definition](#definitions) by name, optionally altering it by mixing in a hash of key/value pairs. If the definition cannot be found, this method will return `undefined`.

* **name** (_String_)  
  The name of a fixture definition Object.

* **settings** (_Object_)  
  A hash of key/value pairs to mixin to the [fixture definition](#definitions). Matching keys will be overridden.


#### Fixture.isFixture( _value_ ) => _Boolean_

Determine if some value is a `Fixture`. Fails if the value is not an Object of type `Fixture`.

* **value** (_ANY_)  
  The value to test against.


#### Fixture.list( [ _filter_ ] ) => _Array[String]_

Get a list of available [fixture definitions](#definitions) by name.

* **filter( _name_, _fixture_ )** (_Function_) => (_Boolean_ | _undefined_)  
  A function that may be used to filter the list of names. Returning `false` within the filter will exclude the item from the list.

  * **name** (_String_)  
    The name of the `Fixture`.

  * **fixture** (_Fixture_)  
    The `Fixture` object.


#### Fixture.normalize( _value_ ) => _Fixture_ | _Object_

[Normalize](#normalization) a value into a valid `Fixture` or [fixture definition](#definitions). If normalization fails, this method will return `undefined`.

* **value** (_Fixture_ | _Function_ | _Object_ | _String_)  
  The value to be [normalized](#normalization).


## Normalization

For convenience, a [normalization](#fixturenormalize-value---fixture--object) method is provided to allow the use of short-hand syntax when creating and defining fixtures and fixture definitions, respectively. This is especially helpful when using fixtures as part of an extensible library.

The following is a list of what to expect when passing values of certain types:

* **String** => _Object_  
  Alias of [Fixture.get( value )](#fixtureget-name-settings---object).

* **Function** => _Object_  
  Short-hand for `{ interact: value }`.

* **Object** => _Object_  
  Alias of [Fixture.get( value.name, value )](#fixtureget-name-settings---object). If a [fixture definition](#definitions) is not found for `value.name`, the value itself is returned.

* **Fixture** => _Fixture_  
  If the value is a `Fixture`, it is returned as-is.


All other values will result in the normalization method returning `undefined`.


## Definitions

```javascript
Fixture.define("number-incrementer", {
  attach: function() {
    this.data.num = 0;
  },
  data: {
    num: 0
  },
  detach: function() {
    this.data.num = 0;
  },
  interact: function() {
    this.data.num++;
  },
  verify: function() {
    return this.data.num === 1;
  }
});
```

Fixture definitions are plain Objects that provide base configuration settings for ease of reuse and modification. They are created and stored internally by passing a hash of key/value pairs to the [Fixture.define()](#fixturedefine--name--definition-) method. Definitions can be used as-is during `Fixture` instantiation or mixed into other definitions on retrieval via the [Fixture.get()](#fixtureget-name-settings---objects) method. The list of currently defined definition names can be retrieved through the [Fixture.list()](#fixturelist--arraystring) method.


### Requirements

Definitions may contain any of the standard [methods](#instance-methods) and [properties](#instance-properties) inherent to `Fixture` instances, but they _must_ contain a unique name and _at least one_ of the following methods: _attach_, _detach_, _use_ or _verify_. Names may be [namespaced](http://en.wikipedia.org/wiki/Namespace) to prevent same-name collisions by placing a period (".") at the end of the name followed by a personal identifier, such as: `foo.myfoo`.


## Contributing

Install developer dependencies with [npm](https://www.npmjs.org/) by running `npm install && npm install -g grunt-cli`. Run tasks with [Grunt](http://gruntjs.com/) (see the [Gruntfile](https://raw.githubusercontent.com/fixturejs/fixture/master/Gruntfile.js) for a full list of tasks). For example, to generate a build, run `grunt build`. Please follow the coding conventions already in place. Using [EditorConfig](http://editorconfig.org/) is highly encouraged.

## License

Copyright &copy; 2014 Kyle Florence  
Fixtures is dual licensed under the [BSD](license-bsd) and [MIT](license-mit) licenses.
