/**
 * An example basic application using stores/widgets/actions
 * @module dojo-app-example/app
 */
import createMemoryStore from 'dojo-widgets/util/createMemoryStore';
import createButton from 'dojo-widgets/createButton';
import createLayoutContainer from 'dojo-widgets/createLayoutContainer';
import createList from 'dojo-widgets/createList';
import createPanel from 'dojo-widgets/createPanel';
import createResizePanel from 'dojo-widgets/createResizePanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';
import projector from 'dojo-widgets/projector';
import { Renderable } from 'dojo-widgets/mixins/createRenderable';
import createAction from 'dojo-actions/createAction';

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
const widgetStore = createMemoryStore({
	data: [
		{ id: 'header', label: 'Dojo 2 Example Application'},
		{ id: 'layout-container', classes: [ 'horizontal' ] },
		{ id: 'panel-fixed', classes: [ 'fixed' ] },
		{ id: 'panel-resize', classes: [ 'vertical', 'border-right', 'pad-1em' ], width: '200px' },
		{ id: 'remove', label: 'Remove', name: 'remove' },
		{ id: 'first-name', name: 'first-name', value: 'qat' },
		{ id: 'add', label: 'Add', name: 'add' },
		{ id: 'list', classes: [ 'margin-1em' ], items: listItems }
	]
});

const widgets: Renderable[] = [];

/**
 * A header widget
 */
const header = createWidget({
	id: 'header',
	stateFrom: widgetStore,
	tagName: 'h1'
});

widgets.push(header);

const layoutContainer = createLayoutContainer({
	id: 'layout-container',
	stateFrom: widgetStore
});

widgets.push(layoutContainer);

projector.append(widgets);

const panelFixed = createPanel({
	id: 'panel-fixed',
	stateFrom: widgetStore
});

layoutContainer.append(panelFixed);

const panelResize = createResizePanel({
	id: 'panel-resize',
	stateFrom: widgetStore
});

panelFixed.append(panelResize);

/**
 * Button will remove item from list
 */
const removeButton = createButton({
	id: 'remove',
	stateFrom: widgetStore
});

panelResize.append(removeButton);

/**
 * A widget for collecting the value of the list
 */
const firstName = createTextInput({
	id: 'first-name',
	stateFrom: widgetStore
});

panelResize.append(firstName);

/**
 * A widget that will add the value to the list
 */
const addButton = createButton({
	id: 'add',
	stateFrom: widgetStore
});

panelResize.append(addButton);

/**
 * The list widget
 */
const list = createList({
	id: 'list',
	stateFrom: widgetStore
});

panelFixed.append(list);

/**
 * An action that will pop an item from the list item and patch the items into the widgetstore
 */
const actionPopList = createAction({
	type: 'pop-list',
	do() {
		listItems.pop();
		return widgetStore.patch({ id: 'list', items: listItems });
	}
});

/**
 * Connect the buttons onclick to the action
 */
removeButton.on('click', actionPopList);

/**
 * An action that will take the value from the text input, push it onto the list and patch
 * the widget store
 */
const actionPushList = createAction({
	type: 'push-list',
	do() {
		const label = firstName.value;
		listItems.push({ id: listItems.length, label: label });
		return widgetStore.patch({ id: 'list', items: listItems }) /* patch the list */
			.patch({ id: 'first-name', value: label }); /* patch the value of fisrt-name */
	}
});

/**
 * Connect the buttons onclick to the action
 */
addButton.on('click', actionPushList);

/**
 * Attach the VDOM
 */
projector.attach();
