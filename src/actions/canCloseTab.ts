import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/App';
import Promise from 'dojo-core/Promise';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface WithStores {
	actions?: Promise<MemoryStore<Object>>;
	widgets?: Promise<MemoryStore<Object>>;
}

export default createAction.extend<WithStores>({})({
	register(registry: CombinedRegistry) {
		const action = <WithStores> this;
		action.actions = registry.getStore('actions');
		action.widgets = registry.getStore('widgets');
	},

	do() {
		const { actions, widgets } = <WithStores> this;
		return Promise.all([actions, widgets]).then(([actions, widgets]) => {
			return actions.patch({ canClose: true }, { id: 'close-tab' })
				.then(() => {
					return widgets.patch({ label: 'Now you can close the tab!!!' }, { id: 'tab-3-content'});
				});
		});
	}
});
