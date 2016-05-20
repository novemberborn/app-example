import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/App';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface WithStores {
	actions?: MemoryStore<Object>;
	widgets?: MemoryStore<Object>;
}

export default createAction.extend<WithStores>({})({
	register(registry: CombinedRegistry) {
		const action = <WithStores> this;
		action.actions = registry.getStore('actions');
		action.widgets = registry.getStore('widgets');
	},

	do() {
		const { actions, widgets } = <WithStores> this;
		return actions.patch({ canClose: true }, { id: 'close-tab' })
			.then(() => {
				return widgets.patch({ label: 'Now you can close the tab!!!' }, { id: 'tab-3-content'});
			});
	}
});
