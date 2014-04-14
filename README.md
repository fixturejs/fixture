# Fixtures

A _fixture_ provides a consistent execution context and reproducible results. For this reason, they are often used in conjunction with [unit tests](http://en.wikipedia.org/wiki/Test_fixture). However, they have many other useful applications.


## Lifecycle

The lifecycle of a fixture is typically composed of these stages, some of which may be optional:

1. **Attachment** - Prepare the execution context needed to reliably use the fixture.
2. **Interaction** - Use the fixture.
3. **Verification** - Verify the expected outcome.
4. **Detachment** - Return the execution context back to its original state.


## Usage

The goal of this project is to set up a standard, lightweight API for the use of fixtures in JavaScript without enforcing a specific pattern of usage. This allows for flexibility, but leaves the burden of enforcement on the implementor.


## API

The following methods are exposed publically, either through the `Fixture` Object in browser environments, or by requiring `fixtures.js` as an [asynchronous module](https://github.com/amdjs/amdjs-api/blob/master/AMD.md).


### Constructor

```javascript
var f = new Fixture();
```

Note that use of the `new` operator is optional.


#### Constructor Parameters

* **settings** _Object_ (optional)  
  A hash of key/value pairs used to configure the fixture instance. Keys should match the standard methods and properties listed below, although non-standard key/value pairs can also be mixed in.


#### Instance Methods

The following instance methods are available on all fixture instances.

* **attach**() (default: [NOP](http://en.wikipedia.org/wiki/NOP))  
  Prepares the proper execution context needed to reliably use the fixture. Generally, anything modified at this time will be undone during detachment.


* **detach**() (default: [NOP](http://en.wikipedia.org/wiki/NOP))  
  Sets the execution context back to its original state. Generally, anything modified during attachment should be undone at this time.


* **equals**( _other_ ) => _Boolean_ (default: `fixture.uuid` comparison)  
  Determines if two fixtures are [equal](README.md#static-methods).
  
  * **other** _Fixture_  
  The `Fixture` to compare against.


* **interact**() (default: [NOP](http://en.wikipedia.org/wiki/NOP))  
  Interact with the fixture. The outcome of use should be consistently reproducible.


* **toString**() => _String_ (default: "Fixture:`fixture.uuid`")  
  The String representation of a fixture.


* **verify**() (default: [NOP](http://en.wikipedia.org/wiki/NOP))  
  Determine if the outcome of using the fixture was expected.


#### Instance Properties

The following instance properties are available on all fixture instances.

* **data** _Object_ (default: empty Object)  
  An arbitrary hash of key/value pairs to associate with the fixture.


* **uuid** _String_, _Number_ (default: internally incremented Integer)  
  The fixture's [Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier).


### Static Methods

The following static methods are available on the `Fixture` Object.

* **create**( _value_ ) => _Fixture_  
  A `Fixture` factory method which takes advantage of [normalization](README.md#normalization) to allow defining fixtures in various ways. If normalization fails, this method will return `undefined`.

  * **value** _Fixture_, _Function_, _Object_, _String_  
  A value that will be [normalized](README.md#normalization) into the settings used to create a `Fixture`.


* **define**( _definition_ )  
  Creates a [fixture definition](README.md#definition).

  * **definition** _Object_  
  The [fixture definition](README.md#definition) Object.


* **equal**( _first_, _second_ ) => _Boolean_  
  Determines if two fixtures are equal by comparing their UUIDs. Fails if either value is not a `Fixture` or if the UUIDs are not [strictly equal](http://ecma-international.org/ecma-262/5.1/#sec-11.9.6).

  * **first** _Fixture_  
  The value used as a basis of comparison.
  
  * **second** _Fixture_  
  The value to be compared against the first.


* **get**( _name_, _settings_ ) => _Object_  
  Get a [fixture definition](README.md#definition) by name, optionally altering it by mixing in a hash of key/value pairs. If the definition cannot be found, this method will return `undefined`.

  * **name** _String_  
  The name of the [fixture definition](README.md#definition).
  
  * **settings** _Object_ (optional)  
  A hash of key/value pairs to mixin to the [fixture definition](README.md#definition). Matching keys will be overridden.


* **isFixture**( _value_ ) => _Boolean_  
  Determine if some value is a `Fixture` instance. Fails if the value is not an Object of type `Fixture`.

  * **value** _ANY_  
    The value to test against.


* **list**() => _Array[String]_  
  Get a list of available [fixture definition](README.md#definition) names.


* **normalize**( _value_ ) => _Fixture_, _Object_  
  [Normalize](README.md#normalization) a value into a valid `Fixture` or [fixture definition](README.md#definition). If normalization fails, this method will return `undefined`.

  * **value** _Fixture_, _Function_, _Object_, _String_  
  A value that will be [normalized](README.md#normalization) into the settings used to create a `Fixture`.


## Normalization

For convenience, a [normalization](README.md#static-methods) method is provided to allow the use of short-hand syntax when creating and defining fixtures and fixture definitions, respectively. This is especially helpful when using fixtures as part of an extensible library.

The following is a list of what to expect when passing values of certain types:

* **String** => _Object_ ([fixture definition](README.md#definition))  
  Alias for [Fixture.get( value )](README.md#static-methods).

* **Function** => _Object_ ([fixture definition](README.md#definition))  
  Alias for `{ interact: value }`.

* **Object** => _Object_ ([fixture definition](README.md#definition))  
  Alias for [Fixture.get( value.name, value )](README.md#static-methods), falling back to returning the Object itself if the former returns `undefined`.

* **Fixture** => _Fixture_  
  If the value is a `Fixture`, it is returned as-is.


All other values will result in the normalization method returning `undefined`.


## Definitions

Fixture definitions are plain Objects that provide base configuration settings for ease of reuse and modification. They are created and stored internally by passing a hash of key/value pairs to the [Fixture.define()](README.md#static-methods) method. Definitions can be used as-is during `Fixture` instantiation or mixed into other definitions on retrieval via the [Fixture.get()](README.md#static-methods) method. The list of currently defined definition names can be retrieved through the [Fixture.list()](README.md#static-methods) method.

### Requirements

Definitions may contain any of the standard [methods](README.md#instance-methods) and [properties](README.md#instance-properties) inherent to `Fixture` instances, but they _must_ contain a unique name and _at least one_ of the following methods: _attach_, _detach_, _use_ or _verify_. Names may be [namespaced](http://en.wikipedia.org/wiki/Namespace) to prevent same-name collisions by placing a period (".") at the end of the name followed by a personal identifier, such as: `foo.myfoo`.

## License

Copyright &copy; 2014 Kyle Florence  
Fixtures is dual licensed under the [BSD](license-bsd) and [MIT](license-mit) licenses.