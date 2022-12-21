import demoImages from "../../../src/__tests__/demoImages.json";

describe("Image Details route", () => {
    it("clicks outside the modal", () => {
        cy.intercept("GET", "/api/images/latest?limit=10", {
            statusCode: 200,
            body: demoImages,
        });
        cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
            statusCode: 200,
            body: demoImages.images[0],
        });
        cy.visit("/image/" + demoImages.images[0]._id);

        cy.get(".v-overlay__scrim").click(0, 0, {force: true});

        cy.url().should("include", "/");
        cy.get("img").should("have.length", 11);
    })
    it("clicks the close button", () => {
        cy.intercept("GET", "/api/images/latest?limit=10", {
            statusCode: 200,
            body: demoImages,
        });
        cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
            statusCode: 200,
            body: demoImages.images[0],
        });
        cy.visit("/image/" + demoImages.images[0]._id);

        cy.get(".mdi-close").click();

        cy.url().should("include", "/");
        cy.get("img").should("have.length", 11);
    })
    it("visits the image detail url", () => {
        cy.intercept("GET", "/api/images/latest?limit=10", {
            statusCode: 200,
            body: demoImages,
        });
        cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
            statusCode: 200,
            body: demoImages.images[0],
        });
        cy.visit("/image/" + demoImages.images[0]._id);

        cy.get("img").should("have.length", 12);
    });
    
});
