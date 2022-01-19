import bcrypt from "bcryptjs";

const users = [
  {
    firstName: "Admin1",
    lastName: "User",
    email: "admin1@example.com",
    profileImage:
      "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
    password: bcrypt.hashSync("123456PAs@", 10),
    isAdmin: true,
  },
  {
    firstName: "Admin2",
    lastName: "User",
    email: "admin2@example.com",
    profileImage:
      "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
    password: bcrypt.hashSync("123456PAs@", 10),
    isAdmin: true,
  },
  {
    firstName: "Admin3",
    lastName: "User",
    email: "admin3@example.com",
    profileImage:
      "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
    password: bcrypt.hashSync("123456PAs@", 10),
    isAdmin: true,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    profileImage:
      "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
    password: bcrypt.hashSync("123456PAs@", 10),
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    profileImage:
      "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
    password: bcrypt.hashSync("123456PAs@", 10),
  },
];

export default users;
