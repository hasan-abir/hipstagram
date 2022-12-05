describe("Profile route", () => {
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

    cy.visit("/profile");

    cy.contains("section", "Profile");
  });
  it("visits and gets redirected to login", () => {
    cy.visit("/profile");

    cy.url().should("include", "/login");
  });
});
