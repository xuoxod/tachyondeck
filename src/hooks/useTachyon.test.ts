import { renderHook, act } from '@testing-library/react-native';
import { useTachyon } from './useTachyon';
import { SignalingService } from '../services/SignalingService';

jest.mock('../services/SignalingService');

describe('useTachyon Hook', () => {
  let mockSignalingService: any;

  beforeEach(() => {
    mockSignalingService = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      sendMessage: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
    };
    (SignalingService as jest.Mock).mockImplementation(() => mockSignalingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTachyon({ url: 'ws://test.url' }));

    expect(result.current.output).toEqual([]);
    expect(result.current.isConnected).toBe(false);
  });

  it('updates connection state on events', () => {
    const { result } = renderHook(() => useTachyon({ url: 'ws://test.url' }));

    act(() => {
      const connectHandler = mockSignalingService.on.mock.calls.find((call: any) => call[0] === 'connectionStateChange')?.[1];
      if (connectHandler) connectHandler('connected');
    });

    expect(result.current.isConnected).toBe(true);

    act(() => {
      const connectHandler = mockSignalingService.on.mock.calls.find((call: any) => call[0] === 'connectionStateChange')?.[1];
      if (connectHandler) connectHandler('disconnected');
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('appends output on terminal_output messages', () => {
    const { result } = renderHook(() => useTachyon({ url: 'ws://test.url' }));

    act(() => {
      const messageHandler = mockSignalingService.on.mock.calls.find((call: any) => call[0] === 'message')?.[1];
      if (messageHandler) messageHandler({ type: 'terminal_output', data: 'hello world' });
    });

    expect(result.current.output).toEqual(['hello world']);
  });

  it('filters empty commands', () => {
    const { result } = renderHook(() => useTachyon({ url: 'ws://test.url' }));

    act(() => {
      result.current.sendCommand('   ');
    });

    expect(mockSignalingService.sendMessage).not.toHaveBeenCalled();
    expect(result.current.output).toEqual([]);
  });

  it('sends command, updates UI optimally', () => {
    const { result } = renderHook(() => useTachyon({ url: 'ws://test.url' }));

    act(() => {
      result.current.sendCommand('ls -la');
    });

    expect(mockSignalingService.sendMessage).toHaveBeenCalledWith({
      type: 'terminal_input',
      data: 'ls -la'
    });
    expect(result.current.output).toEqual(['> ls -la']);
  });
});
