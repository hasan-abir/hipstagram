describe("Login route", () => {
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

    cy.visit("/login");

    cy.url().should("include", "/");
  });
  it("visits, logs in and gets redirected to home", () => {
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
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: { token: "123" },
    });

    cy.visit("/login");
    cy.get("input[type='text']").type("hasanabir@test.com");
    cy.get("input[type='password']").type("testtest");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/");
  });
  it("visits the login url", () => {
    cy.visit("/login");
    cy.contains("h1", "Login");
  });
});
