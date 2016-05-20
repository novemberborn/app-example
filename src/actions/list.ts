import createAction from 'dojo-actions/createAction';
import { CombinedRegistry, Identity } from 'dojo-app/App';
import Promise from 'dojo-core/Promise';
import { TextInput } from 'dojo-widgets/createTextInput';
import { MemoryStore } from 'dojo-widgets/util/createMemoryStore';

interface ListItem {
	id: number;
	label: string;
}

interface ListState {
	id: 'list';
	items: ListItem[];
}

interface WithStore {
	store?: Promise<MemoryStore<ListState>>;
}

interface PushList extends WithStore {
	getWidget?(id: 'first-name'): Promise<TextInput>;
	getWidget?(id: Identity): Promise<any>;
}

export const pushList = createAction.extend<PushList>({})({
	register(registry: CombinedRegistry) {
		const action = <PushList> this;
		action.getWidget = registry.getWidget;
		action.store = registry.getStore('widgets');
	},

	do() {
		const { getWidget, store } = <PushList> this;

		return getWidget('first-name').then(({ value: label }) => {
			return store.then(store => {
				return store.get('list').then(({ items }) => {
					items.push({ id: items.length, label });
					return store
						.patch({ id: 'list', items }) /* patch the list */
						.patch({ id: 'first-name', value: label }); /* patch the value of fisrt-name */
				});
			});
		});
	}
});

export const popList = createAction.extend<WithStore>({})({
	register(registry: CombinedRegistry) {
		const action = <WithStore> this;
		action.store = registry.getStore('widgets');
	},

	do() {
		const { store } = <WithStore> this;
		return store.then(store => {
			return store.get('list').then(({ items }) => {
				items.pop();
				return store.patch({ id: 'list', items });
			});
		});
	}
});
