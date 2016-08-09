import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/createApp';
import Promise from 'dojo-shim/Promise';
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
	store?: MemoryStore<ListState>;
}

interface PushList extends WithStore {
	firstName?: TextInput;
}

export const pushList = createAction.extend<PushList>({})({
	configure(registry: CombinedRegistry) {
		return Promise.all<any>([
			registry.getWidget('first-name'),
			registry.getStore('widgets')
		]).then(([widget, store]) => {
			const action = <PushList> this;
			action.firstName = <TextInput> widget;
			action.store = <MemoryStore<ListState>> store;
		});
	},

	do() {
		const {
			firstName: { value: label },
			store
		} = <PushList> this;

		return store.get('list').then(({ items }) => {
			items.push({ id: items.length, label });
			return store
				.patch({ id: 'list', items }) /* patch the list */
				.patch({ id: 'first-name', value: label }); /* patch the value of fisrt-name */
		});
	}
});

export const popList = createAction.extend<WithStore>({})({
	configure(registry: CombinedRegistry) {
		return registry.getStore('widgets').then(store => {
			(<WithStore> this).store = <MemoryStore<ListState>> store;
		});
	},

	do() {
		const { store } = <WithStore> this;
		return store.get('list').then(({ items }) => {
			items.pop();
			return store.patch({ id: 'list', items });
		});
	}
});
