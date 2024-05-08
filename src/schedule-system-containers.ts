import { Debugger, Loop, System } from "@rbxts/matter";
import { Context, HotReloader } from "@rbxts/rewire";

import { ResourceRecord, SystemParameters } from "./types";

export function scheduleSystemContainers<R extends ResourceRecord>(
	loop: Loop<SystemParameters<R>>,
	debug: Debugger<SystemParameters<R>>,
	containers: Folder[],
) {
	const hotReloader = new HotReloader();
	const systemsByModule = new Map<ModuleScript, System<SystemParameters<R>>>();
	let firstRunSystems: System<SystemParameters<R>>[] | undefined = [];

	function loadSystemModule(module: ModuleScript, context: Context) {
		const previousSystem = systemsByModule.get(context.originalModule);
		const [success, result] = pcall(require, module);

		if (!success) {
			warn("Error occured when hot-reloading system", module.Name, result);
			return;
		}

		const system = result as System<SystemParameters<R>>;

		if (firstRunSystems) {
			firstRunSystems.push(system);
		} else if (previousSystem) {
			loop.replaceSystem(previousSystem, system);
			debug.replaceSystem(previousSystem, system);
		} else {
			loop.scheduleSystem(system);
		}

		systemsByModule.set(module, system);
	}

	function unloadSystemModule(_: ModuleScript, context: Context) {
		if (context.isReloading) {
			return;
		}

		const originalModule = context.originalModule;
		const previousSystem = systemsByModule.get(originalModule);

		if (previousSystem) {
			loop.evictSystem(previousSystem);
			systemsByModule.delete(originalModule);
		}
	}

	// Scan containers
	for (const container of containers) {
		hotReloader.scan(container, loadSystemModule, unloadSystemModule);
	}

	// Schedule startup systems
	loop.scheduleSystems(firstRunSystems);
	firstRunSystems = undefined;

	// Initialize debugger
	debug.autoInitialize(loop);
}
