import { Loop, World } from "@rbxts/matter";
import { RunService } from "@rbxts/services";

import { createDebugger } from "./create-debugger";
import { scheduleSystemContainers } from "./schedule-system-containers";
import { DebuggerConfig, MatterSignalLike, ResourceRecord, SystemParameters } from "./types";

interface MatterAppConfig<R extends ResourceRecord> {
	/**
	 * Optional world to use. If no world is specified, one is automatically created.
	 */
	world?: World;
	/**
	 * Object that contains "resources."
	 *
	 * Resources are essentially globally unique data, and this object can be accessed from systems.
	 */
	resources: R;
	/**
	 * The system containers to use.
	 */
	containers: Folder[];
	/**
	 * Loop events to use.
	 */
	events?: {
		[index: string]: MatterSignalLike<unknown[]>;
	};
	/**
	 * Debugger config.
	 */
	debugger: DebuggerConfig;
}

/**
 * Creates the matter app.
 *
 * @param config The {@link MatterAppConfig | config} to use.
 */
export function createMatterApp<const R extends ResourceRecord>({
	world = new World(),
	resources,
	containers,
	events = {},
	debugger: debuggerConfig,
}: MatterAppConfig<R>) {
	// Create matter classes
	const debug = createDebugger(world, debuggerConfig);
	const loop = new Loop<SystemParameters<R>>(world, resources, debug.getWidgets());

	// Schedule system containers
	scheduleSystemContainers(loop, debug, containers);

	// Start loop
	const connections = loop.begin({
		default: RunService.PostSimulation,
		...events,
	});

	return () => {
		for (const [, connection] of pairs(connections)) {
			connection.Disconnect();
		}
	};
}
