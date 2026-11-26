import { afterEach, describe, expect, it } from 'vitest';
import { EventBus } from './EventBus';
import type { InputState } from './KeyboardInput';
import { VirtualInput } from './VirtualInput';

const idle: InputState = { left: false, right: false, down: false, jumpHeld: false, jumpPressed: false, interactPressed: false, upPressed: false };
const press = (buttons: Partial<{ left: boolean; right: boolean; jump: boolean }>) =>
  EventBus.emit('ui-virtual-input', { left: false, right: false, jump: false, ...buttons });

describe('VirtualInput (touch buttons → game input)', () => {
  let input: VirtualInput;
  afterEach(() => input?.destroy());

  it('passes keyboard input through untouched when no button is held', () => {
    input = new VirtualInput();
    const keys = { ...idle, left: true, interactPressed: true };
    expect(input.mergeInto(keys)).toEqual(keys);
  });

  it('merges held direction buttons with the keyboard', () => {
    input = new VirtualInput();
    press({ right: true });
    expect(input.mergeInto(idle)).toMatchObject({ right: true, left: false });
    expect(input.mergeInto({ ...idle, left: true })).toMatchObject({ right: true, left: true });
  });

  it('reports a jump press exactly once, even for a tap shorter than a frame', () => {
    input = new VirtualInput();
    press({ jump: true });
    press({ jump: false }); // released before the next frame
    expect(input.mergeInto(idle)).toMatchObject({ jumpPressed: true, jumpHeld: false });
    expect(input.mergeInto(idle).jumpPressed).toBe(false);
  });

  it('holds jump while the button stays down (variable jump height)', () => {
    input = new VirtualInput();
    press({ jump: true });
    expect(input.mergeInto(idle)).toMatchObject({ jumpPressed: true, jumpHeld: true });
    expect(input.mergeInto(idle)).toMatchObject({ jumpPressed: false, jumpHeld: true });
  });

  it('stops listening when destroyed', () => {
    input = new VirtualInput();
    input.destroy();
    press({ left: true });
    expect(input.mergeInto(idle).left).toBe(false);
  });
});

describe('EventBus', () => {
  it('delivers payloads and unsubscribes', () => {
    const seen: boolean[] = [];
    const off = EventBus.on('ui-modal-changed', ({ open }) => seen.push(open));
    EventBus.emit('ui-modal-changed', { open: true });
    off();
    EventBus.emit('ui-modal-changed', { open: false });
    expect(seen).toEqual([true]);
  });

  it('lets a listener unsubscribe while being called without skipping others', () => {
    const calls: string[] = [];
    const offA = EventBus.on('ui-interact-request', () => {
      calls.push('a');
      offA();
    });
    const offB = EventBus.on('ui-interact-request', () => calls.push('b'));
    EventBus.emit('ui-interact-request', null);
    EventBus.emit('ui-interact-request', null);
    offB();
    expect(calls).toEqual(['a', 'b', 'b']);
  });
});
