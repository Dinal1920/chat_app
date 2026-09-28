import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
  //token banavu
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //ms
    httpOnly: true, // javascript thi access na thay, security mate
    sameSite: "lax", // request same site thi aave, CSRF attack thi bachav mate
    // secure: process.env.NODE_ENV !== "development",
    secure: false,
  })

  return token
}