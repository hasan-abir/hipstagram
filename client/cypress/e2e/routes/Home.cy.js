describe("Home route", () => {
  it("visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Here are the latest pictures uploaded by users!");
  });

  it("visits the app root url with auth user", () => {
    cy.visit("/");
    cy.contains("h1", "Here are the latest pictures uploaded by users!");
  });
});
