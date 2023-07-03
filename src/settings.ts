import {  SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin";

export const settings: SettingSchemaDesc[] = [
  {
    key: "typewriterModeDealyMs",
    description: "Measured in milliseconds (ms), the shorter the time, the more prompt the response, but the corresponding cost is higher. Conversely, the longer the time, the more sluggish the response, but the cost is lower.",
    type: "number",
    default: 100,
    title: "Reaction interval time",
  },
];
