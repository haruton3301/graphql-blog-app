import "@testing-library/jest-dom"
import { afterAll, afterEach, beforeAll } from "vitest"
import { server } from "../mocks/setup/server"

export const mockedUseNavigate = vi.fn()
vi.mock("react-router-dom", async () => {
  const mod =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom")
  return {
    ...mod,
    useNavigate: () => mockedUseNavigate,
  }
})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
