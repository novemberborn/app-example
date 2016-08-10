/**
 * An example basic application using stores/widgets/actions
 * @module dojo-app-example/app
 */
import Promise from 'dojo-shim/Promise';
import createMemoryStore from 'dojo-widgets/util/createMemoryStore';
import createButton from 'dojo-widgets/createButton';
import createList from 'dojo-widgets/createList';
import createPanel from 'dojo-widgets/createPanel';
import createResizePanel from 'dojo-widgets/createResizePanel';
import createTabbedPanel from 'dojo-widgets/createTabbedPanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';
import { ParentListMixin } from 'dojo-widgets/mixins/createParentListMixin';

import createApp, { WidgetLike } from 'dojo-app/createApp';

import { popList, pushList } from './actions/list';

type Appendable = WidgetLike & ParentListMixin<WidgetLike>;

const app = createApp({ toAbsMid: require.toAbsMid });

/**
 * A memory store which handles the widget states
 */
const widgets = createMemoryStore({
	data: [
		{ id: 'header', label: 'Dojo 2 Example Application'},
		{ id: 'tabbed-panel', classes: [ 'pad-1em' ] },
		{ id: 'tab-1', label: 'Tab 1', closeable: false },
		{ id: 'layout-container', classes: [ 'horizontal' ] },
		{ id: 'panel-fixed', classes: [ 'fixed' ] },
		{ id: 'panel-resize', classes: [ 'vertical', 'border-right', 'pad-1em' ], width: '200px' },
		{ id: 'remove', label: 'Remove', name: 'remove' },
		{ id: 'first-name', name: 'first-name', value: 'qat' },
		{ id: 'add', label: 'Add', name: 'add' },
		{
			id: 'list',
			classes: [ 'margin-1em' ],
			items: [
				{ id: 1, label: 'foo' },
				{ id: 2, label: 'bar' },
				{ id: 3, label: 'baz' },
				{ id: 4, label: 'qux' },
				{ id: 5, label: 'norf' }
			]
		},
		{ id: 'tab-2', classes: [ 'pad-1em' ], label: 'Tab 2', closeable: true },
		{ id: 'tab-2-content', label: 'You can close me!' },
		{ id: 'tab-3', classes: [ 'pad-1em' ], label: 'Tab 3', closeable: true },
		{ id: 'tab-3-content', label: 'You can try to close me, but...'},
		{ id: 'can-close', label: 'Can Close' }
	]
});
app.registerStore('widgets', widgets);

app.loadDefinition({
	actions: [
		{
			id: 'close-tab',
			factory: './actions/closeTab',
			stateFrom: 'actions'
		}
	]
});

/**
 * A header widget
 */
app.registerWidgetFactory('header', () => {
	return Promise.resolve(createWidget({
		id: 'header',
		stateFrom: widgets,
		tagName: 'h1'
	}));
});

app.registerCustomElementFactory('tabbed-panel', createTabbedPanel);

app.loadDefinition({
	widgets: [
		{
			id: 'tab-1',
			factory: createPanel,
			stateFrom: 'widgets'
		},
		{
			id: 'layout-container',
			factory: 'dojo-widgets/createLayoutContainer',
			stateFrom: 'widgets'
		},
		{
			id: 'panel-fixed',
			factory: createPanel,
			stateFrom: 'widgets'
		},
		{
			id: 'panel-resize',
			factory: createResizePanel,
			stateFrom: 'widgets'
		},
		/**
		 * Button will remove item from list
		 */
		{
			id: 'remove',
			factory: createButton,
			stateFrom: 'widgets',
			listeners: {
				click: 'pop-list'
			}
		},
		/**
		 * A widget for collecting the value of the list
		 */
		{
			id: 'first-name',
			factory: createTextInput,
			stateFrom: 'widgets'
		},
		/**
		 * A widget that will add the value to the list
		 */
		{
			id: 'add',
			factory: createButton,
			stateFrom: 'widgets',
			listeners: {
				click: 'push-list'
			}
		},
		/**
		 * The list widget
		 */
		{
			id: 'list',
			factory: createList,
			stateFrom: 'widgets'
		},
		{
			id: 'tab-2',
			factory: createPanel,
			stateFrom: 'widgets'
		},
		{
			id: 'tab-2-content',
			factory: createWidget,
			stateFrom: 'widgets',
			options: {
				tagName: 'div'
			}
		},
		{
			id: 'tab-3',
			factory: createPanel,
			stateFrom: 'widgets',
			listeners: {
				close: 'close-tab'
			}
		},
		{
			id: 'tab-3-content',
			factory: createWidget,
			stateFrom: 'widgets',
			options: {
				tagName: 'div'
			}
		},
		{
			id: 'can-close',
			factory: createButton,
			stateFrom: 'widgets',
			listeners: {
				click: 'can-close-tab'
			}
		}
	]
});

app.registerAction('pop-list', popList);
app.registerAction('push-list', pushList);

const ready = app.realize(document.getElementById('declarative')).then(() => {
	return Promise.all([
		'panel-resize',
		'remove',
		'first-name',
		'add',
		'tab-2',
		'tab-2-content',
		'tab-3',
		'tab-3-content',
		'can-close'
	].map(id => app.getWidget(id))).then(([
		panelResize,
		remove,
		firstName,
		add,
		tab2,
		tab2Content,
		tab3,
		tab3Content,
		canClose
	]) => {
		(<Appendable> panelResize).append(remove);
		(<Appendable> panelResize).append(firstName);
		(<Appendable> panelResize).append(add);
		(<Appendable> tab2).append(tab2Content);
		(<Appendable> tab3).append(tab3Content);
		(<Appendable> tab3).append(canClose);

		/**
		 * Attach the VDOM
		 */
		return app.realize(document.body);
	});
});

// This will hook into unhandledRejection helpers in dev tools
(<any> window).Promise.resolve(ready);
