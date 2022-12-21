import demoImages from "../../../src/__tests__/demoImages.json";

describe("Home route", () => {
  it("clicks on show more", () => {
    const initialDemoImages = { ...demoImages };
    initialDemoImages.images = initialDemoImages.images.slice(0, 8);

    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: initialDemoImages,
    });

    const restOfDemoImages = { ...demoImages };
    restOfDemoImages.images = restOfDemoImages.images.slice(8, 10);
    restOfDemoImages.next = false;

    cy.intercept("GET", "/api/images/latest?limit=10&next=" + demoImages.next, {
      statusCode: 200,
      body: restOfDemoImages,
    });
    cy.visit("/");
    cy.get("img").should("have.length", 9);

    cy.get("button").contains("Show more").click();
    cy.get("img").should("have.length", 11);
    cy.get("button").contains("Show more").should("not.exist");
  });

  it("visits the app root url", () => {
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    cy.visit("/");

    cy.get("img").should("have.length", 11);
  });
});
