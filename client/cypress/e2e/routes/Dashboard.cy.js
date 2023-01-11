import demoImages from "../../../src/__tests__/demoImages.json";

describe("Dashboard route", () => {
  it("clicks upload image", () => {
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
    const imagesBeforeUpload = { ...demoImages };

    imagesBeforeUpload.images = imagesBeforeUpload.images.slice(1);

    cy.intercept(
      "GET",
      "/api/images/latest?limit=10&username=" + user.username,
      {
        statusCode: 200,
        body: imagesBeforeUpload,
      }
    ).as("loadImages1");

    cy.visit("/dashboard");

    cy.intercept("POST", "/api/images/upload", {
      statusCode: 200,
    });

    cy.get(".v-card").should("have.length", 9);
    cy.intercept(
      "GET",
      "/api/images/latest?limit=10&username=" + user.username,
      {
        statusCode: 200,
        body: demoImages,
      }
    ).as("loadImages2");
    cy.get("textarea").eq(0).type("Lorem");
    cy.get("input[type=file]").selectFile("cypress/e2e/airplane.jpg", {
      force: true,
    });
    cy.get("button").filter(":contains('Upload')").eq(0).click();

    cy.get(".v-card").should("have.length", 10);
    cy.contains("Image uploaded").should("be.visible");
  });
  it("clicks update image", () => {
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

    cy.intercept("PUT", "/api/images/edit/" + demoImages.images[0]._id, {
      statusCode: 200,
    });

    const updatedCaption = "Lorem Ipsum";
    const imagesAfterUpdate = { ...demoImages };

    imagesAfterUpdate.images = imagesAfterUpdate.images.map((img, index) => {
      const image = { ...img };

      if (index === 0) {
        image.caption = updatedCaption;
      }

      return image;
    });

    cy.get(".v-card").should("have.length", 10);
    cy.get("textarea").eq(1).type(updatedCaption);
    cy.get("button").filter(":contains('Update')").eq(0).click();
    cy.contains("Caption updated!").should("be.visible");
  });
  it("clicks delete image", () => {
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
    ).as("loadImages1");

    cy.visit("/dashboard");

    cy.intercept("DELETE", "/api/images/remove/" + demoImages.images[0]._id, {
      statusCode: 200,
    });

    const imagesAfterDelete = { ...demoImages };

    imagesAfterDelete.images = imagesAfterDelete.images.slice(1);

    cy.get(".v-card").should("have.length", 10);
    cy.intercept(
      "GET",
      "/api/images/latest?limit=10&username=" + user.username,
      {
        statusCode: 200,
        body: imagesAfterDelete,
      }
    ).as("loadImages2");
    cy.get("button").filter(":contains('Delete')").eq(0).click();

    cy.get(".v-card").should("have.length", 9);
  });
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
    cy.get("button").filter(":contains('Upload')").eq(0).should("be.visible");
  });
  it("visits and gets redirected to login", () => {
    cy.visit("/dashboard");

    cy.url().should("include", "/login");
  });
});
