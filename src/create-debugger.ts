import { Debugger, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";
import { RunService, UserInputService } from "@rbxts/services";

import { DebuggerConfig, ResourceRecord, SystemParameters } from "./types";

export function createDebugger<R extends ResourceRecord>(world: World, debuggerConfig: DebuggerConfig) {
	const debug = new Debugger<SystemParameters<R>>(Plasma);

	debug.findInstanceFromEntity = (id) => {
		return world.contains(id) ? debuggerConfig.getInstanceForEntity(id) : undefined;
	};

	debug.authorize = debuggerConfig.authorize;

	if (RunService.IsClient()) {
		// Connect keybind toggler on the client
		UserInputService.InputBegan.Connect((input, gameProcessedEvent) => {
			if (debuggerConfig.keys.includes(input.KeyCode) && !gameProcessedEvent) {
				debug.toggle();
			}
		});
	}

	return debug;
}
