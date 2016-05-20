import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/App';
import Promise from 'dojo-core/Promise';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface WithStore {
	store?: Promise<MemoryStore<Object>>;
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
		return store.then(store => {
			return store.patch(
				{ label: 'I said you can\'t close me' },
				{ id: 'tab-3-content' }
			);
		});
	}
});