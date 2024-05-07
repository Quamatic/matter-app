import { Debugger, World } from "@rbxts/matter";
import Plasma from "@rbxts/plasma";

import { DebuggerConfig, ResourceRecord, SystemParameters } from "./types";

export function createDebugger<R extends ResourceRecord>(world: World, debuggerConfig: DebuggerConfig) {
	const _debugger = new Debugger<SystemParameters<R>>(Plasma);

	_debugger.findInstanceFromEntity = (id) => {
		if (!world.contains(id)) {
			return undefined;
		}

		return debuggerConfig.getInstanceForEntity(id);
	};

	_debugger.authorize = debuggerConfig.authorize;

	return _debugger;
}
