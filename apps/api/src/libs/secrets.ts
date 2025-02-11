import dotenv from "dotenv"

dotenv.config()

const validateEnvVar = (varName: string, type: "string"): string => {
  const value = process.env[varName]
  if (!value) {
    console.error(`${varName} is not defined in environment variables`)
    process.exit(1)
  }

  if (type === "string" && typeof value !== "string") {
    console.error(`${varName} should be a string`)
    process.exit(1)
  }

  return value
}

export const secrets = {
  API_PORT: validateEnvVar("API_PORT", "string"),
  DATABASE_URL: validateEnvVar("DATABASE_URL", "string"),
  JWT_SECRET: validateEnvVar("JWT_SECRET", "string"),
}
