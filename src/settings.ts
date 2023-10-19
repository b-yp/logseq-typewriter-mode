import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const settings: SettingSchemaDesc[] = [
  {
    key: "typewriterModeDealyMs",
    description: "Measured in milliseconds (ms), the shorter the time, the more prompt the response, but the corresponding cost is higher. Conversely, the longer the time, the more sluggish the response, but the cost is lower.",
    type: "number",
    default: 100,
    title: "Reaction interval time",
  },
  {
    key: "typewriterModeIsSmooth",
    description: "Not enabled by default, there will be noticeable jumping sensation during page scrolling, but with better performance. If enabled, page scrolling will be relatively smoother, but with worse performance.",
    type: "boolean",
    default: true,
    title: "Enable smooth scrolling",
  },
];
