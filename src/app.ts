/**
 * An example basic application using stores/widgets/actions
 * @module dojo-app-example/app
 */
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
const header = createWidget({
	id: 'header',
	stateFrom: widgets,
	tagName: 'h1'
});
app.registerWidget('header', header);

const tabbedPanel = createTabbedPanel({
	id: 'tabbed-panel',
	stateFrom: widgets
});
app.registerWidget('tabbed-panel', tabbedPanel);

const tab1 = createPanel({
	id: 'tab-1',
	stateFrom: widgets
});
app.registerWidget('tab-1', tab1);

const layoutContainer = createLayoutContainer({
	id: 'layout-container',
	stateFrom: widgets
});
app.registerWidget('layout-container', layoutContainer);

const panelFixed = createPanel({
	id: 'panel-fixed',
	stateFrom: widgets
});
app.registerWidget('panel-fixed', panelFixed);

const panelResize = createResizePanel({
	id: 'panel-resize',
	stateFrom: widgets
});
app.registerWidget('panel-resize', panelResize);

/**
 * Button will remove item from list
 */
const remove = createButton({
	id: 'remove',
	stateFrom: widgets
});
app.registerWidget('remove', remove);

/**
 * A widget for collecting the value of the list
 */
const firstName = createTextInput({
	id: 'first-name',
	stateFrom: widgets
});
app.registerWidget('first-name', firstName);

/**
 * A widget that will add the value to the list
 */
const add = createButton({
	id: 'add',
	stateFrom: widgets
});
app.registerWidget('add', add);

/**
 * The list widget
 */
const list = createList({
	id: 'list',
	stateFrom: widgets
});
app.registerWidget('list', list);

const tab2 = createPanel({
	id: 'tab-2',
	stateFrom: widgets
});
app.registerWidget('tab-2', tab2);

const tab2Content = createWidget({
	id: 'tab-2-content',
	stateFrom: widgets,
	tagName: 'div'
});
app.registerWidget('tab-2-content', tab2Content);

const tab3 = createPanel({
	id: 'tab-3',
	stateFrom: widgets
});
app.registerWidget('tab-3', tab3);

const tab3Content = createWidget({
	id: 'tab-3-content',
	stateFrom: widgets,
	tagName: 'div'
});
app.registerWidget('tab-3-content', tab3Content);

const canClose = createButton({
	id: 'can-close',
	stateFrom: widgets
});
app.registerWidget('can-close', canClose);

tabbedPanel.append(tab1);
tab1.append(layoutContainer);
layoutContainer.append(panelFixed);
panelFixed.append(panelResize);
panelResize.append(remove);
panelResize.append(firstName);
panelResize.append(add);
panelFixed.append(list);
tabbedPanel.append(tab2);
tab2.append(tab2Content);
tabbedPanel.append(tab3);
tab3.append(tab3Content);
tab3.append(canClose);

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
	header,
	tabbedPanel
]);
projector.attach();
