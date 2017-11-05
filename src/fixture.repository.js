/* start-build-ignore */
define(["src/utils", "src/fixture"], function(utils, Fixture) {
/* end-build-ignore */
function Repository(fixtures) {
  this.fixtures = {};

  if (fixtures !== undefined) {
    this.set(fixtures);
  }
}

utils.extend(Repository.prototype, {

  /**
   * Get all Fixtures matching the given value(s).
   * @param {*} value The value(s) to match.
   * @returns The matching Fixtures.
   */
  get: function(value) {
    var
      fixtures = [],
      name,
      results = [];

    for (name in this.fixtures) {
      fixtures.push(this.fixtures[name]);
    }

    // Return everything if no value is given.
    if (value === null || value === undefined) {
      results = fixtures;

    } else {
      console.log("value", value);
      utils.makeArray(value).forEach(function(value) {
        fixtures.forEach(function(fixture) {
          if (
            value === fixture ||
            value === fixture.uuid ||
            // Match against namespace or name
            new RegExp(value + "(?:\\.|$)").test(fixture.name)
          ) {
            results.push(fixture);
          }
        });
      });
    }

    return results;
  },

  /**
   * Checks for the given value(s) in the repository.
   * @param {*} value The value(s) to match.
   * @returns True if the given value(s) are in the repository, false otherwise.
   */
  has: function(value) {
    return utils.makeArray(value).length === this.get(value).length;
  },

  /**
   * Remove Fixtures which match the given value.
   * @param {*} value The value used to find matching Fixtures.
   * @returns The Fixtures that were removed.
   */
  remove: function(value) {
    var
      fixtures = this.get(value);

    fixtures.forEach(function(fixture) {
      delete this.fixtures[fixture.name];
    }, this);

    return fixtures;
  },

  /**
   * Store a Fixture by name.
   * @param {*} value The name of the Fixture, an Array of Fixtures, or an Object containing name/Fixture pairs.
   * @param {*} fixture The Fixture, if setting a single Fixture by name.
   */
  set: function(value, fixture) {
    var
      name,
      fixtures = {};

    // Support for an Object of name/Fixture pairs.
    if (typeof value === "object") {
      fixtures = value;

    // Support setting a single Fixture by name and value.
    } else if (typeof value === "string") {
      fixtures[value] = fixture;

    // Support setting an Array of Fixtures.
    } else if (utils.typeOf(value) === "array") {
      value.forEach(function(fixture) {
        if (!fixture.name) {
          throw "Cannot set Fixture: missing name.";

        } else if (fixtures[fixture.name]) {
          throw "Cannot set Fixture: duplicate name '" + fixture.name + "'.";
        }

        fixtures[fixture.name] = fixture;
      });

    } else {
      throw "Cannot set Fixture: invalid argument type: " + utils.typeOf(value);
    }

    for (name in fixtures) {
      fixture = fixtures[name];

      if (!Fixture.isFixture(fixture)) {
        throw "Cannot set Fixture: Fixture is invalid.";

      } else if (this.fixtures[name]) {
        throw "Cannot set Fixture: '" + name + "' is already defined.";
      }

      fixture.name = name;
      this.fixtures[name] = fixture;
    }
  }
});

// Expose publicly on Fixture.
Fixture.Repository = Repository;

return Repository;
/* start-build-ignore */
});
/* end-build-ignore */
