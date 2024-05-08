import { Debugger, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";

import { DebuggerConfig, ResourceRecord, SystemParameters } from "./types";

export function createDebugger<R extends ResourceRecord>(world: World, debuggerConfig: DebuggerConfig) {
	const _debugger = new Debugger<SystemParameters<R>>(Plasma);

	_debugger.findInstanceFromEntity = (id) => {
		return world.contains(id) ? debuggerConfig.getInstanceForEntity(id) : undefined;
	};

	_debugger.authorize = debuggerConfig.authorize;

	return _debugger;
}
