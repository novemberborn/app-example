/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />
/// <reference path="../node_modules/dojo-actions/dist/typings/dojo-actions/dojo-actions.d.ts" />
/// <reference path="../node_modules/dojo-core/typings/dojo-core/dojo-core.d.ts" />
/// <reference path="../node_modules/dojo-core/typings/symbol-shim/symbol-shim.d.ts" />
/// <reference path="../node_modules/dojo-compose/dist/umd/dojo-compose.d.ts" />
/// <reference path="../node_modules/dojo-loader/typings/dojo-loader/dojo-loader.d.ts" />
/// <reference path="../node_modules/dojo-typings/dijit/1.11/modules.d.ts" />
/// <reference path="../node_modules/dojo-widgets/typings/dojo-widgets/dojo-widgets.d.ts" />
/// <reference path="../node_modules/@reactivex/rxjs/typings/main/ambient/es6-shim/index.d.ts" />

declare module 'immutable/immutable' {
	export = Immutable;
}

declare module 'maquette/maquette' {
	export * from 'node_modules/maquette/dist/maquette';
}

declare module 'rxjs/Rx' {
	export * from 'node_modules/@reactivex/rxjs/dist/cjs/Rx';
}

declare module 'rxjs/Observable' {
	export * from 'node_modules/@reactivex/rxjs/dist/cjs/Observable';
}

declare module 'rxjs/Observer' {
	export * from 'node_modules/@reactivex/rxjs/dist/cjs/Observer';
}

/* For some reasons reactivex/rxjs is missing these */
interface Iterator<T> {
	next(value?: any): IteratorResult<T>;
	return?(value?: any): IteratorResult<T>;
	throw?(e?: any): IteratorResult<T>;
}

interface Iterable<T> {
	[Symbol.iterator](): Iterator<T>;
}
