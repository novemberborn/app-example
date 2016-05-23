import createAction from 'dojo-actions/createAction';
import { CombinedRegistry } from 'dojo-app/App';

export default function (registry: CombinedRegistry) {
	return registry.getStore('widgets').then((store) => {
		return createAction({
			do({ event }: { event?: any } = {}) {
				if (!event || this.state.canClose) {
					return;
				}

				event.preventDefault();
				return store.patch(
					{ label: 'I said you can\'t close me' },
					{ id: 'tab-3-content' }
				);
			}
		});
	});
};
