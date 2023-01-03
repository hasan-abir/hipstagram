import demoImages from "../../../src/__tests__/demoImages.json";

describe("Dashboard route", () => {
  it("visits authenticated", () => {
    const user = {
      avatar: {
        fileId: "cat",
        url: "https://s36537.pcdn.co/wp-content/uploads/2018/01/An-orange-tabby-cat-with-the-M-marking-on-the-forehead.jpg.optimal.jpg",
      },
      username: "Hasan",
      email: "Hasan Abir",
    };

    localStorage.setItem("jwtToken", "123");

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: user,
    });
    cy.intercept(
      "GET",
      "/api/images/latest?limit=10&username=" + user.username,
      {
        statusCode: 200,
        body: demoImages,
      }
    );

    cy.visit("/dashboard");

    cy.contains("Welcome, " + user.username);
    cy.get(".v-card").should("have.length", 10);
    cy.get("button").filter(":contains('Update')").should("have.length", 10);
    cy.get("button").filter(":contains('Delete')").should("have.length", 10);
  });
  it("visits and gets redirected to login", () => {
    cy.visit("/dashboard");

    cy.url().should("include", "/login");
  });
});
