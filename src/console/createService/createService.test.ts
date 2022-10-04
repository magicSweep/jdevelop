import { createMocks__, createService_ } from ".";

describe("Create service", () => {
  const existsSync = jest.fn(() => false);
  const mkdir = jest.fn(() => Promise.resolve());
  const createMainFile = jest.fn(() => Promise.resolve());
  const createMainFakeFile = jest.fn(() => Promise.resolve());
  const createMainMockFile = jest.fn(() => Promise.resolve());
  const createMainFakeMockFile = jest.fn(() => Promise.resolve());

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createMocks__", () => {
    const createMocks_ = createMocks__(
      mkdir as any,
      createMainMockFile,
      createMainFakeMockFile
    );

    test("", async () => {
      await createMocks_("/path-to-dir");

      expect(mkdir).toHaveBeenCalledTimes(1);
      expect(mkdir).toHaveBeenNthCalledWith(1, "/path-to-dir/__mocks__");

      expect(createMainMockFile).toHaveBeenCalledTimes(1);
      expect(createMainMockFile).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/__mocks__"
      );

      expect(createMainFakeMockFile).toHaveBeenCalledTimes(1);
      expect(createMainFakeMockFile).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/__mocks__"
      );
    });
  });

  describe("createService_", () => {
    const createMocks = jest.fn(() => Promise.resolve());

    const createService = createService_(
      existsSync,
      mkdir as any,
      createMainFile,
      createMainFakeFile,
      createMocks
    );

    test("", async () => {
      await createService({
        name: "SuperService",
        cnfPath: "/path-to-dir",
      });

      expect(existsSync).toHaveBeenCalledTimes(1);
      expect(existsSync).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/SuperService"
      );

      expect(mkdir).toHaveBeenCalledTimes(1);
      expect(mkdir).toHaveBeenNthCalledWith(1, "/path-to-dir/SuperService");

      expect(createMainFile).toHaveBeenCalledTimes(1);
      expect(createMainFile).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/SuperService"
      );

      expect(createMainFakeFile).toHaveBeenCalledTimes(1);
      expect(createMainFakeFile).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/SuperService"
      );

      expect(createMocks).toHaveBeenCalledTimes(1);
      expect(createMocks).toHaveBeenNthCalledWith(
        1,
        "/path-to-dir/SuperService"
      );
    });
  });
});
