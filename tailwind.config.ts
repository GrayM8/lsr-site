import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  plugins: [typography],

  // Optional extras, can enable later:
  // prefix: "tw-",
  // corePlugins: { preflight: true },
}

export default config
