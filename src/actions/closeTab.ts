import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/App';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface WithStore {
	store?: MemoryStore<Object>;
}

export default createAction.extend<WithStore>({})({
	register(registry: CombinedRegistry) {
		const action = <WithStore> this;
		action.store = registry.getStore('widgets');
	},

	do({ event }: { event?: any } = {}) {
		if (!event || this.state.canClose) {
			return;
		}

		event.preventDefault();
		const { store } = <WithStore> this;
		return store.patch(
			{ label: 'I said you can\'t close me' },
			{ id: 'tab-3-content' }
		);
	}
});
