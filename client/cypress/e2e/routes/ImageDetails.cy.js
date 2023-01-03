import demoImages from "../../../src/__tests__/demoImages.json";
import demoComments from "../../../src/__tests__/demoComments.json";

describe("Image Details route", () => {
  it("visits, deletes comment", () => {
    const author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: author,
    });
    localStorage.setItem("jwtToken", "123");
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    cy.intercept(
      "GET",
      "/api/feedback/likes/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 0,
          isLiked: false,
        },
      }
    );

    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = author;
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });

    const commentsResponse = { ...demoComments };

    commentsResponse.comments = commentsResponse.comments.slice(0, -1);
    cy.intercept(
      "GET",
      "/api/feedback/comments/image/" + demoImages.images[0]._id + "?limit=10",
      {
        statusCode: 200,
        body: commentsResponse,
      }
    );
    const lastComment = demoComments.comments[demoComments.comments.length - 1];
    cy.intercept("POST", "/api/feedback/comment/" + lastComment._id, {
      statusCode: 200,
      body: null,
    });
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".text-error").click();

    cy.contains("p", lastComment.text).should("not.exist");
  });
  it("visits, posts comment", () => {
    const author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: author,
    });
    localStorage.setItem("jwtToken", "123");
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    cy.intercept(
      "GET",
      "/api/feedback/likes/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 1,
          isLiked: true,
        },
      }
    );

    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = author;
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });

    const commentsResponse = { ...demoComments };

    commentsResponse.comments = commentsResponse.comments.slice(0, -1);
    cy.intercept(
      "GET",
      "/api/feedback/comments/image/" + demoImages.images[0]._id + "?limit=10",
      {
        statusCode: 200,
        body: commentsResponse,
      }
    );
    const newComment = demoComments.comments[demoComments.comments.length - 1];
    cy.intercept(
      "POST",
      "/api/feedback/comment/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: newComment,
      }
    );
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get("textarea").type(newComment.text);

    cy.get("button[type='submit']").click();

    cy.contains(newComment.text);
  });
  it("visits, unlikes the image", () => {
    const author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: author,
    });
    localStorage.setItem("jwtToken", "123");
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });

    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = author;
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });

    cy.intercept(
      "GET",
      "/api/feedback/likes/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 1,
          isLiked: true,
        },
      }
    );
    cy.intercept(
      "DELETE",
      "/api/feedback/unlike/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 0,
          isLiked: false,
        },
      }
    );
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".mdi-heart").click();

    cy.get(".rounded-pill").contains("0");
    cy.get(".mdi-heart-outline").should("exist");
  });
  it("visits, likes the image", () => {
    const author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };

    cy.intercept("GET", "/api/auth/currentuser", {
      statusCode: 200,
      body: author,
    });
    localStorage.setItem("jwtToken", "123");
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    cy.intercept(
      "GET",
      "/api/feedback/likes/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 1,
          isLiked: true,
        },
      }
    );

    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = author;
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });

    cy.intercept(
      "POST",
      "/api/feedback/like/image/" + demoImages.images[0]._id,
      {
        statusCode: 200,
        body: {
          likesCount: 1,
          isLiked: true,
        },
      }
    );
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".mdi-heart-outline").click();

    cy.get(".rounded-pill").contains("1");
    cy.get(".mdi-heart").should("exist");
  });
  it("visits to a non existing url", () => {
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 404,
      body: { msg: "Image not found" },
    });
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.contains("Image not found").should("exist");

    cy.get(".v-card").should("have.length", 10);
  });
  it("clicks outside the modal", () => {
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".v-overlay__scrim").click(0, 0, { force: true });

    cy.url().should("include", "/");
    cy.get(".v-card").should("have.length", 10);
  });
  it("clicks the close button", () => {
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".mdi-close").click();

    cy.url().should("include", "/");
    cy.get(".v-card").should("have.length", 10);
  });
  it("visits the image detail url", () => {
    cy.intercept("GET", "/api/images/latest?limit=10", {
      statusCode: 200,
      body: demoImages,
    });
    const imageDetail = { ...demoImages.images[0] };
    imageDetail.author = {
      avatar: {
        url: "https://ik.imagekit.io/ozjxi1bzek/hipstagram_users/male_ZkJR1ReV5.jpg",
        fileId: "male",
      },
      username: "Hasan Abir",
      gender: "male",
      email: "hasanabir@test.com",
      createdAt: "2022-12-19T05:09:48.031Z",
      updatedAt: "2022-12-19T05:09:48.031Z",
    };
    cy.intercept("GET", "/api/images/details/" + demoImages.images[0]._id, {
      statusCode: 200,
      body: imageDetail,
    });
    cy.visit("/image/" + demoImages.images[0]._id);

    cy.get(".v-card").should("have.length.greaterThan", 10);
  });
});
