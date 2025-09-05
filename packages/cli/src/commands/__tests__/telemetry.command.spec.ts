/* 
Test framework note:
- These tests are written to be compatible with either Vitest or Jest.
- They use conditional globals (vi/jest) and fallback shims to keep compatibility without new deps.
*/

type AnyFn = (...args: any[]) => any

const isVitest = typeof vi !== "undefined"
const isJest = typeof jest !== "undefined"
const mockFn: <T extends AnyFn=AnyFn>() => jest.MockedFunction<T> & ReturnType<typeof vi.fn> = (isVitest ? vi.fn : (isJest ? jest.fn : (() => { throw new Error("No test runner globals found"); }))) as any
const doMock = (isVitest ? vi.mock : (isJest ? jest.mock : ((..._args: any[]) => {}))) as unknown as (id: string, factory?: AnyFn) => void
const resetAllMocks = (isVitest ? vi.resetAllMocks : (isJest ? jest.resetAllMocks : (() => {}))) as unknown as () => void
const spyOn = (isVitest ? vi.spyOn : (isJest ? jest.spyOn : (() => { throw new Error("No spyOn available"); }))) as unknown as typeof vi.spyOn

// Module under test path:
// The implementation file is misnamed as telemetry.test.ts but exports TelemetryCommand.
// We import via relative path ending with .test to match the given file name.
doMock("inquirer", () => {
  return {
    default: {
      prompt: mockFn()
    }
  }
})

/**
 * Mock logger: createLogger returns an object with detail() and error()
 */
doMock("../utils/logger.js", () => {
  const detail = mockFn()
  const error = mockFn()
  return {
    createLogger: mockFn(() => ({ detail, error })),
    Logger: class {}
  }
})

/**
 * Mock Telemetry util with controllable behavior per test
 */
const mockGetInfo = mockFn()
const mockSetEnabled = mockFn()
const mockShutdown = mockFn()

doMock("../utils/telemetry.js", () => {
  return {
    Telemetry: class {
      options: any
      constructor(opts: any) {
        this.options = opts
      }
      getInfo = mockGetInfo
      setEnabled = mockSetEnabled
      shutdown = mockShutdown
    }
  }
})

// Now import after mocks are configured
import inquirer from "inquirer"
import { TelemetryCommand } from "../telemetry.test.js" // implementation file provided in PR

describe("TelemetryCommand", () => {
  const baseInfo = {
    enabled: true,
    userId: "user-123",
    configPath: "/home/test/.dot-ui/telemetry.json",
    dataCollection: [
      "Command usage (names, flags)",
      "Execution duration",
      "Anonymous errors"
    ]
  }

  const makeCmd = (overrides: Partial<{ verbose: boolean }> = {}) => {
    return new TelemetryCommand({
      verbose: overrides.verbose ?? false
    } as any)
  }

  beforeEach(() => {
    resetAllMocks()
    ;(inquirer as any).default.prompt.mockReset?.()
    mockGetInfo.mockReset()
    mockSetEnabled.mockReset()
    mockShutdown.mockReset()
  })

  test("execute() with no action shows interactive menu and then executes chosen action; always calls shutdown", async () => {
    mockGetInfo.mockResolvedValueOnce({ ...baseInfo, enabled: false })
    ;(inquirer as any).default.prompt.mockResolvedValueOnce({ action: "status" })
    mockGetInfo.mockResolvedValueOnce(baseInfo) // for showStatus()

    const cmd = makeCmd()
    // Spy on console output
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute()

    // Menu and subsequent action executed
    expect((inquirer as any).default.prompt).toHaveBeenCalledTimes(1)
    expect(mockGetInfo).toHaveBeenCalledTimes(2)
    expect(mockShutdown).toHaveBeenCalledTimes(1)

    // Status header printed
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Telemetry Status"))

    logSpy.mockRestore()
  })

  test("execute() handles 'exit' from interactive menu and still shuts down", async () => {
    mockGetInfo.mockResolvedValueOnce(baseInfo)
    ;(inquirer as any).default.prompt.mockResolvedValueOnce({ action: "exit" })

    const cmd = makeCmd()
    await cmd.execute()

    expect((inquirer as any).default.prompt).toHaveBeenCalled()
    // No further action calls
    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    expect(mockShutdown).toHaveBeenCalledTimes(1)
  })

  test("status action prints current status and guidance", async () => {
    mockGetInfo.mockResolvedValueOnce({ ...baseInfo, enabled: true })
    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("status")

    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Enabled: Yes"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("dot-ui telemetry disable"))

    logSpy.mockRestore()
    expect(mockShutdown).toHaveBeenCalledTimes(1)
  })

  test("status action when disabled prints enable guidance", async () => {
    mockGetInfo.mockResolvedValueOnce({ ...baseInfo, enabled: false })
    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("status")

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Enabled: No"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("dot-ui telemetry enable"))

    logSpy.mockRestore()
  })

  test("info action lists data collection items and privacy guarantees", async () => {
    mockGetInfo.mockResolvedValueOnce(baseInfo)
    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("info")

    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    // Ensures the enumerated list is printed
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/1\.\s+Command usage/))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Privacy Guarantees"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("GDPR"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Config file"))

    logSpy.mockRestore()
  })

  test("enable action prompts for consent; confirms enables telemetry and prints thanks", async () => {
    // showDataCollectionInfo -> getInfo
    mockGetInfo.mockResolvedValueOnce(baseInfo)
    ;(inquirer as any).default.prompt.mockResolvedValueOnce({ confirm: true })

    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("enable")

    expect(mockGetInfo).toHaveBeenCalledTimes(1)
    expect((inquirer as any).default.prompt).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ type: "confirm", name: "confirm" })
      ])
    )
    expect(mockSetEnabled).toHaveBeenCalledWith(true)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Telemetry enabled"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Thank you"))

    logSpy.mockRestore()
  })

  test("enable action declines consent; does not enable telemetry and prints instructions", async () => {
    mockGetInfo.mockResolvedValueOnce(baseInfo)
    ;(inquirer as any).default.prompt.mockResolvedValueOnce({ confirm: false })

    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("enable")

    expect(mockSetEnabled).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Telemetry remains disabled"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("telemetry enable"))

    logSpy.mockRestore()
  })

  test("disable action disables telemetry and prints guidance", async () => {
    const cmd = makeCmd()
    const logSpy = spyOn(console, "log").mockImplementation(() => {})

    await cmd.execute("disable")

    expect(mockSetEnabled).toHaveBeenCalledWith(false)
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Telemetry disabled"))
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("telemetry enable"))

    logSpy.mockRestore()
  })

  test("unknown action logs error", async () => {
    const cmd = makeCmd()
    const { createLogger } = await import("../utils/logger.js") as any
    const loggerInstance = createLogger.mock.results[0].value
    await (cmd as any).executeAction("bogus")

    expect(loggerInstance.error).toHaveBeenCalledWith("Unknown action: bogus")
  })

  test("execute() catches thrown errors and logs; still shuts down", async () => {
    // Force showStatus to throw by making getInfo reject
    const error = new Error("Boom")
    mockGetInfo.mockRejectedValueOnce(error)
    const cmd = makeCmd()
    const { createLogger } = await import("../utils/logger.js") as any
    const loggerInstance = createLogger.mock.results[0].value

    await cmd.execute("status")

    expect(loggerInstance.error).toHaveBeenCalledWith(
      expect.stringContaining("Telemetry command failed: Boom")
    )
    expect(mockShutdown).toHaveBeenCalledTimes(1)
  })
})