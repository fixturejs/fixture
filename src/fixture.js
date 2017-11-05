/* start-build-ignore */
define(["src/utils"], function(utils) {
/* end-build-ignore */
var uuid = 0;

function isFixture(value) {
  return utils.typeOf(value) === "fixture";
}

function Fixture(settings) {
  settings = settings || {};

  this.data = {};

  if (utils.typeOf(settings.data) === "object") {
    utils.extend(this.data, settings.data);
  }

  if (utils.typeOf(settings.name) === "string") {
    this.name = settings.name;
  }

  if (utils.typeOf(settings.attach) === "function") {
    this.attach = settings.attach;
  }

  if (utils.typeOf(settings.detach) === "function") {
    this.detach = settings.detach;
  }

  if (utils.typeOf(settings.interact) === "function") {
    this.interact = settings.interact;
  }

  if (utils.typeOf(settings.verify) === "function") {
    this.verify = settings.verify;
  }

  this.uuid = uuid++;
}

utils.extend(Fixture.prototype, {
  attach: utils.noop,
  detach: utils.noop,
  equals: function(other) {
    return isFixture(other) && this.uuid === other.uuid;
  },
  interact: utils.noop,
  toString: function() {
    return "Fixture: " + this.uuid;
  },
  verify: utils.noop
});

utils.extend(Fixture, {
  equal: function(first, second) {
    return isFixture(first) && first.equals(second);
  },

  isFixture: isFixture
});
/* start-build-ignore */
return Fixture;
});
/* end-build-ignore */
