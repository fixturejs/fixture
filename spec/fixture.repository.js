define(["src/fixture", "src/fixture.repository", "src/utils"], function(Fixture, Repository, utils) {
  describe("Repository.constructor", function() {
    it("should instantiate", function() {
      var repository = new Repository();
      expect(utils.typeOf(repository)).toBe("repository");
      expect(repository.fixtures).toEqual({});
    });
  });

  describe("Repository.prototype.get", function() {
    it("should return matching Fixtures", function() {
      var fixture = new Fixture();
      var repository = new Repository({
        "fixture": fixture,
        "fixture.copy": fixture
      });

      expect(repository.get().length).toBe(2);
      expect(repository.get("fixture.copy").length).toBe(2);
    });
  });
});
