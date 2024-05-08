import type { AnyEntity, DebugWidgets, World } from "@rbxts/matter";

export type ResourceRecord = Record<string, unknown>;
export type SystemParameters<T extends ResourceRecord> = [world: World, resources: T, widgets: DebugWidgets];

// Matter only accepts :Connect() naming
// So of course a custom type + RBXScriptSignal is all that will work
export type MatterSignalLike<T extends unknown[]> =
	| RBXScriptSignal<(...args: T) => void>
	| {
			Connect(callback: (...args: T) => void): unknown;
	  };

export interface DebuggerConfig {
	/**
	 * Keybinds used for toggling the debugger.
	 */
	keys: Enum.KeyCode[];
	/**
	 * The authorization function.
	 */
	authorize: (player: Player) => boolean;
	/**
	 * Callback to get an instance that references the given entity.
	 *
	 * If there is none, then `undefined` should be returned.
	 */
	getInstanceForEntity: (id: AnyEntity) => Instance | undefined;
}
