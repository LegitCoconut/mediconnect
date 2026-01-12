export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard", "/hospital/dashboard", "/doctor/dashboard"] }
