import { createFunc_ } from ".";

(global.console as any) = {
  log: jest.fn(),
  error: jest.fn(),
};

describe("createFunc_", () => {
  const existsSync = jest.fn(() => false);
  const mkdir = jest.fn(() => Promise.resolve());
  const createMainFile = jest.fn(() => Promise.resolve());
  const createStoriesFile = jest.fn(() => Promise.resolve());
  const createTestFile = jest.fn(() => Promise.resolve());

  const createFunc = createFunc_(
    existsSync,
    mkdir as any,
    createMainFile,
    createStoriesFile,
    createTestFile
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("All okey", async () => {
    await createFunc({
      name: "someName",
      cnfPath: "/path/to/dir",
    });

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      "[SUCCESS CREATED] /path/to/dir/someName"
    );

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(createMainFile).toHaveBeenCalledTimes(1);
    expect(createStoriesFile).toHaveBeenCalledTimes(1);
    expect(createTestFile).toHaveBeenCalledTimes(1);
  });

  test("Error on make dir", async () => {
    mkdir.mockRejectedValueOnce("Do not wanna create dir...");

    await createFunc({
      name: "someName",
      cnfPath: "/path/to/dir",
    });

    expect(console.log).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);

    expect(console.error).toHaveBeenNthCalledWith(
      1,
      "CAN NOT CREATE REACT FUNC",
      "Do not wanna create dir..."
    );

    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(createMainFile).toHaveBeenCalledTimes(0);
    expect(createStoriesFile).toHaveBeenCalledTimes(0);
    expect(createTestFile).toHaveBeenCalledTimes(0);
  });
});
