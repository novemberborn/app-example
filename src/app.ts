/**
 * An example basic application using stores/widgets/actions
 * @module dojo-app-example/app
 */
import Promise from 'dojo-core/Promise';
import createMemoryStore from 'dojo-widgets/util/createMemoryStore';
import createButton from 'dojo-widgets/createButton';
import createLayoutContainer from 'dojo-widgets/createLayoutContainer';
import createList from 'dojo-widgets/createList';
import createPanel from 'dojo-widgets/createPanel';
import { RenderableMixin } from 'dojo-widgets/mixins/createRenderable';
import createResizePanel from 'dojo-widgets/createResizePanel';
import createTabbedPanel from 'dojo-widgets/createTabbedPanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';
import projector from 'dojo-widgets/projector';
import { ParentMixin, Child } from 'dojo-widgets/mixins/createParentMixin';
import { Destroyable } from 'dojo-compose/mixins/createDestroyable';

import App from 'dojo-app/App';

import closeTab from './actions/closeTab';
import canCloseTab from './actions/canCloseTab';
import { popList, pushList } from './actions/list';

type Appendable = ParentMixin<Child>;
type Projectable = Destroyable & RenderableMixin;

const app = new App();

/**
 * List items to populate list widget
 */
const listItems = [
	{ id: 1, label: 'foo' },
	{ id: 2, label: 'bar' },
	{ id: 3, label: 'baz' },
	{ id: 4, label: 'qux' },
	{ id: 5, label: 'norf' }
];

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
		{ id: 'list', classes: [ 'margin-1em' ], items: listItems },
		{ id: 'tab-2', classes: [ 'pad-1em' ], label: 'Tab 2', closeable: true },
		{ id: 'tab-2-content', label: 'You can close me!' },
		{ id: 'tab-3', classes: [ 'pad-1em' ], label: 'Tab 3', closeable: true },
		{ id: 'tab-3-content', label: 'You can try to close me, but...'},
		{ id: 'can-close', label: 'Can Close' }
	]
});
app.registerStore('widgets', widgets);

const actions = createMemoryStore({
	data: [
		{ id: 'close-tab', canClose: false, enabled: true },
		{ id: 'can-close-tab', enabled: true }
	]
});
app.registerStore('actions', actions);

/**
 * A header widget
 */
app.registerWidget('header', createWidget({
	id: 'header',
	stateFrom: widgets,
	tagName: 'h1'
}));

app.registerWidget('tabbed-panel', createTabbedPanel({
	id: 'tabbed-panel',
	stateFrom: widgets
}));

app.registerWidget('tab-1', createPanel({
	id: 'tab-1',
	stateFrom: widgets
}));

app.registerWidget('layout-container', createLayoutContainer({
	id: 'layout-container',
	stateFrom: widgets
}));

app.registerWidget('panel-fixed', createPanel({
	id: 'panel-fixed',
	stateFrom: widgets
}));

app.registerWidget('panel-resize', createResizePanel({
	id: 'panel-resize',
	stateFrom: widgets
}));

/**
 * Button will remove item from list
 */
app.registerWidget('remove', createButton({
	id: 'remove',
	stateFrom: widgets
}));

/**
 * A widget for collecting the value of the list
 */
app.registerWidget('first-name', createTextInput({
	id: 'first-name',
	stateFrom: widgets
}));

/**
 * A widget that will add the value to the list
 */
app.registerWidget('add', createButton({
	id: 'add',
	stateFrom: widgets
}));

/**
 * The list widget
 */
app.registerWidget('list', createList({
	id: 'list',
	stateFrom: widgets
}));

app.registerWidget('tab-2', createPanel({
	id: 'tab-2',
	stateFrom: widgets
}));

app.registerWidget('tab-2-content', createWidget({
	id: 'tab-2-content',
	stateFrom: widgets,
	tagName: 'div'
}));

app.registerWidget('tab-3', createPanel({
	id: 'tab-3',
	stateFrom: widgets
}));

app.registerWidget('tab-3-content', createWidget({
	id: 'tab-3-content',
	stateFrom: widgets,
	tagName: 'div'
}));

app.registerWidget('can-close', createButton({
	id: 'can-close',
	stateFrom: widgets
}));

Promise.all([
	'header',
	'tabbed-panel',
	'tab-1',
	'layout-container',
	'panel-fixed',
	'panel-resize',
	'remove',
	'first-name',
	'add',
	'list',
	'tab-2',
	'tab-2-content',
	'tab-3',
	'tab-3-content',
	'can-close'
].map(id => app.getWidget(id))).then(([
	header,
	tabbedPanel,
	tab1,
	layoutContainer,
	panelFixed,
	panelResize,
	remove,
	firstName,
	add,
	list,
	tab2,
	tab2Content,
	tab3,
	tab3Content,
	canClose
]) => {
	(<Appendable> tabbedPanel).append(<Child> tab1);
	(<Appendable> tab1).append(<Child> layoutContainer);
	(<Appendable> layoutContainer).append(<Child> panelFixed);
	(<Appendable> panelFixed).append(<Child> panelResize);
	(<Appendable> panelResize).append(<Child> remove);
	(<Appendable> panelResize).append(<Child> firstName);
	(<Appendable> panelResize).append(<Child> add);
	(<Appendable> panelFixed).append(<Child> list);
	(<Appendable> tabbedPanel).append(<Child> tab2);
	(<Appendable> tab2).append(<Child> tab2Content);
	(<Appendable> tabbedPanel).append(<Child> tab3);
	(<Appendable> tab3).append(<Child> tab3Content);
	(<Appendable> tab3).append(<Child> canClose);

	/**
	 * An action that will pop an item from the list item and patch the items into the widgetstore
	 */
	app.registerAction('pop-list', popList);

	/**
	 * Connect the buttons onclick to the action
	 */
	remove.on('click', popList);

	/**
	 * An action that will take the value from the text input, push it onto the list and patch
	 * the widget store
	 */
	app.registerAction('push-list', pushList);

	/**
	 * Connect the buttons onclick to the action
	 */
	add.on('click', pushList);

	app.registerAction('close-tab', closeTab);
	closeTab.observeState('close-tab', actions);
	tab3.on('close', closeTab);

	app.registerAction('can-close-tab', canCloseTab);
	canClose.on('click', canCloseTab);

	/**
	 * Attach the VDOM
	 */
	projector.append([
		<Projectable> header,
		<Projectable> tabbedPanel
	]);
	projector.attach();
});
