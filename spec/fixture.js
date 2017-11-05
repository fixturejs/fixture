define(["src/fixture", "src/utils"], function(Fixture, utils) {
  describe("Fixture.constructor", function() {
    it("should instantiate", function() {
      expect(utils.typeOf(new Fixture())).toBe("fixture");
    });

    it("should instantiate with default values", function() {
      var fixture = new Fixture();
      expect(fixture.data).toEqual({});
      expect(fixture.attach).toEqual(utils.noop);
      expect(fixture.detach).toEqual(utils.noop);
      expect(fixture.interact).toEqual(utils.noop);
      expect(fixture.verify).toEqual(utils.noop);
    });

    it("should instantiate with custom data", function () {
      var data = {foo: "foo"};
      expect(new Fixture({data: data}).data).toEqual(data);
    });

    it("should instantiate with custom methods", function () {
      var fixture = new Fixture({
        attach: function() {
          return "attach";
        },
        detach: function() {
          return "detach";
        },
        interact: function() {
          return "interact";
        },
        verify: function() {
          return "verify";
        }
      });
      expect(fixture.attach()).toBe("attach");
      expect(fixture.detach()).toBe("detach");
      expect(fixture.interact()).toBe("interact");
      expect(fixture.verify()).toBe("verify");
    });

    it("should instantiate with uuid", function() {
      var fixture = new Fixture();
      expect(fixture.uuid).toMatch(/\d+/);
      expect(fixture.uuid).not.toEqual(new Fixture().uuid);
    });
  });

  describe("Fixture.equal", function() {
    it("should determine if the two Fixtures are equal", function() {
      var fixture1 = new Fixture();
      var fixture2 = new Fixture();

      expect(Fixture.equal(fixture1, fixture1)).toBe(true);
      expect(Fixture.equal(fixture1, fixture2)).toBe(false);
    });
  });

  describe("Fixture.isFixture", function() {
    it("should determine if the given value is a Fixture", function() {
      expect(Fixture.isFixture(new Fixture())).toBe(true);
      expect(Fixture.isFixture(utils.clone(Fixture()))).toBe(false);
      expect(Fixture.isFixture({})).toBe(false);
      expect(Fixture.isFixture(function () {})).toBe(false);
      expect(Fixture.isFixture(null)).toBe(false);
      expect(Fixture.isFixture(undefined)).toBe(false);
      expect(Fixture.isFixture(0)).toBe(false);
      expect(Fixture.isFixture("")).toBe(false);
    });
  });

  describe("Fixture.prototype.equals", function() {
    it("should determine if the given Fixture is the same as the instance", function() {
      var fixture1 = new Fixture();
      var fixture2 = new Fixture();

      expect(fixture1.equals(fixture1)).toBe(true);
      expect(fixture1.equals(fixture2)).toBe(false);
    });
  });

  describe("Fixture.prototype.toString", function() {
    it("should print Fixture as String", function() {
      var fixture = new Fixture();
      expect(fixture.toString()).toEqual("Fixture: " + fixture.uuid);
    });
  });

  describe("Fixture.Repository", function() {
    it("should exist", function() {
      expect(Fixture.Repository).toBeDefined();
      expect(utils.typeOf(Fixture.Repository)).toBe("function");
    });
  });
});
