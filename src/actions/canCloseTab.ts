import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/createApp';
import Promise from 'dojo-shim/Promise';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface WithStores {
	actions?: MemoryStore<Object>;
	widgets?: MemoryStore<Object>;
}

export default createAction.extend<WithStores>({})({
	configure(registry: CombinedRegistry) {
		return Promise.all([
			registry.getStore('actions'),
			registry.getStore('widgets')
		]).then(([actions, widgets]) => {
			const action = <WithStores> this;
			action.actions = <MemoryStore<Object>> actions;
			action.widgets = <MemoryStore<Object>> widgets;
		});
	},

	do() {
		const { actions, widgets } = <WithStores> this;
		return actions.patch({ canClose: true }, { id: 'close-tab' }).then(() => {
			return widgets.patch({ label: 'Now you can close the tab!!!' }, { id: 'tab-3-content'});
		});
	}
});
