/* start-build-ignore */
define(["src/utils", "src/fixture"], function(utils, Fixture) {
/* end-build-ignore */
function Repository() {
  this.items = [];
}

utils.extend(Repository.prototype, {
  add: function(value) {
    var
      fixture = Fixture.create(value);

    if (fixture) {
      this.items.push(fixture);
    }

    return fixture;
  },

  get: function(value, indices) {
    var
      fixture,
      i,
      j,
      items = [],
      values;

    // Get everything
    if (value == null) {
      items = items.push.apply(items, this.items);

    // Get by name, uuid or fixture
    } else {
      values = utils.makeArray(value);

      for (i = 0; i < values.length; i++) {
        value = values[i];

        for (j = 0; j < this.items.length; j++) {
          fixture = this.items[j];

          if (
            value === fixture ||
            value === fixture.name ||
            value === fixture.uuid
          ) {
            items.push(indices ? j : fixture);
          }
        }
      }
    }

    return items;
  },

  has: function(value) {
    var
      values = utils.makeArray(value);

    return values.length === this.get(values).length;
  },

  remove: function(value) {
    var
      i,
      removed = [],
      items = [],
      indices = this.get(value, true);

    for (i = 0; i < this.items.length; i++) {
      (indices.indexOf(i) < 0 ? items : removed).push(this.items[i]);
    }

    this.items = items;

    return removed;
  },

  removeAll: function() {
    var
      removed = this.items;

    this.items = [];

    return removed;
  }
});

Fixture.Repository = Repository;
/* start-build-ignore */
});
/* end-build-ignore */
