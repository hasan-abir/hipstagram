import demoImages from "../../../src/__tests__/demoImages.json";

describe("User route", () => {
  it("visits unknown url", () => {
    const user = {
      avatar: {
        fileId: "cat",
        url: "https://s36537.pcdn.co/wp-content/uploads/2018/01/An-orange-tabby-cat-with-the-M-marking-on-the-forehead.jpg.optimal.jpg",
      },
      username: "Hasan",
      email: "Hasan Abir",
    };

    const msg = "User doesn't exist";
    cy.intercept("GET", "/api/auth/user/" + user.username, {
      statusCode: 404,
      body: { msg },
    });

    cy.visit("/user/" + user.username);

    cy.contains(msg);
  });
  it("visits url", () => {
    const user = {
      avatar: {
        fileId: "cat",
        url: "https://s36537.pcdn.co/wp-content/uploads/2018/01/An-orange-tabby-cat-with-the-M-marking-on-the-forehead.jpg.optimal.jpg",
      },
      username: "Hasan",
      email: "Hasan Abir",
    };

    cy.intercept("GET", "/api/auth/user/" + user.username, {
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

    cy.visit("/user/" + user.username);

    cy.contains(user.username);
    cy.get(".v-card").should("have.length", 10);
  });
});
