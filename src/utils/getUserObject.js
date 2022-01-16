export default function getUserObject(user, values = {}) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    dateOfBirth: user.dateOfBirth,
    email: user.email,
    isAdmin: user.isAdmin,
    cart: user.cart,
    ...values,
  };
}
