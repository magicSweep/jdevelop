export type Path = string;

export type ReplacerType = "SIMPLE" | "FULL_LINE" | "FAKE_API";

export type ReplacerConfig = {
  // file to work with
  pathToFile: string;
  options: ReplacerOptions[];
};

export type ReplacerOptions = {
  // identify in log messages
  identifier: string;
  //doesReplaceFullLine?: boolean;
  type: ReplacerType;

  isFake?: boolean;

  replaceable: string;
  //
  replacement?: string;
};
