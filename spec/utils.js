define(["src/utils"], function(utils) {
  describe("Utils.clone", function() {
    it("should create a shallow copy of source", function() {
      var
        source = {
          foo: "bar",
          bar: ["foo"],
          baz: { foo: "foo" }
        },
        cloned = utils.clone(source);

      expect(cloned).toEqual(source);
      expect(cloned).not.toBe(source);
    });
  });

  describe("Utils.extend", function() {
    it("should shallow copy properties from source to dest", function() {
      var
        dest = {
          foo: "foo",
          bar: ["bar"],
          baz: { baz: "baz" }
        },
        source = {
          foo: "bar",
          bar: ["foo"],
          baz: { foo: "foo" }
        },
        expected = {
          foo: "bar",
          bar: ["foo"],
          baz: { foo: "foo" }
        };

      expect(utils.extend(dest, source)).toEqual(expected);
    });
  });

  describe("Utils.makeArray", function() {
    it("should convert non-array values into arrays", function() {
      expect(utils.makeArray("foo")).toEqual(["foo"]);
      expect(utils.makeArray(["bar"])).toEqual(["bar"]);
    });
  });

  describe("Utils.noop", function() {
    it("should be a no-op function", function() {
      expect(utils.noop()).toBe(undefined);
    });
  });

  describe("Utils.typeOf", function() {
    it("should return type of value", function() {
      function Foo() {}

      expect(utils.typeOf(0)).toBe("number");
      expect(utils.typeOf(null)).toBe("null");
      expect(utils.typeOf(undefined)).toBe("undefined");
      expect(utils.typeOf(Foo)).toBe("function");
      expect(utils.typeOf({})).toBe("object");
      expect(utils.typeOf([])).toBe("array");
      expect(utils.typeOf(new Foo())).toBe("foo");
    });
  });
});
