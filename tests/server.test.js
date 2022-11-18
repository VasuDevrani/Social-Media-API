import server from "../index.js";

import chai from "chai";
import chaiHttp from "chai-http";
let should = chai.should();

chai.use(chaiHttp);

export let testToken = "";
const id = "637713b66366e00bf748a589";

describe("Users", () => {
  describe("login user with email and password", () => {
    it("should be logged in and return user details", (done) => {
      let user = {
        email: "rakesh@gmail.com",
        password: "rakesh1234"
      };
      chai
        .request(server)
        .post("/api/authenticate")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
          res.body.should.have.property("name").eql('Rakesh');
          res.body.should.have.property("_id");
          res.body.should.have.property("email").eql('rakesh@gmail.com');
          testToken = res.body.token;
          done();
        });
    })
  })
});

describe("Posts", () => {
  describe("create Post", () => {
    it("should create a post for authenticated user", (done) => {
      let post = {
        title: "My first post",
        desc: "this is my first post",
      };
      chai
        .request(server)
        .post("/api/posts/")
        .set({ Authorization: `Bearer ${testToken}` })
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("desc");
          res.body.should.have.property("_id");
          res.body.should.have.property("user");
          done();
        });
    });
  });

  describe("get all user post", () => {
    it("should get all post of authenticated user", (done) => {
        chai
          .request(server)
          .get("/api/posts/all_posts")
          .set({ Authorization: `Bearer ${testToken}` })
          .end((err, res) => {
            console.log(err);
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
          });
      });
  })
});

describe("Comments", () => {
  describe("create comment", () => {
    it("should create a comment on specified post", (done) => {
      let comment = {
        comment: "hello guys!! how are you",
      };
      chai
        .request(server)
        .post(`/api/comments/${id}`)
        .set({ Authorization: `Bearer ${testToken}` })
        .send(comment)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("id");
          done();
        });
    });
  });
});