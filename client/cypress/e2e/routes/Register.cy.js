describe("Register route", () => {
  it("visits authenticated and gets redirects to home", () => {
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

    cy.visit("/register");

    cy.url().should("include", "/");
  });
  it("visits, registers and gets redirected to home", () => {
    const user = {
      avatar: {
        fileId: "cat",
        url: "https://s36537.pcdn.co/wp-content/uploads/2018/01/An-orange-tabby-cat-with-the-M-marking-on-the-forehead.jpg.optimal.jpg",
      },
      username: "Hasan",
      email: "Hasan Abir",
    };

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: user,
    });
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 200,
      body: { token: "123" },
    });

    cy.visit("/register");
    cy.get("input[type='text']").eq(0).type("Hasan");
    cy.get("input[type='text']").eq(1).type("hasanabir@test.com");
    cy.get("input[type='password']").type("testtest");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/");
  });
  it("visits the register url", () => {
    cy.visit("/register");
    cy.contains("h1", "Create an account");
  });
});
