/**
 * An example basic application using stores/widgets/actions
 * @module dojo-app-example/app
 */
import createMemoryStore, { MemoryStore } from 'dojo-widgets/util/createMemoryStore';
import createButton from 'dojo-widgets/createButton';
import createLayoutContainer from 'dojo-widgets/createLayoutContainer';
import createList from 'dojo-widgets/createList';
import createPanel from 'dojo-widgets/createPanel';
import createResizePanel from 'dojo-widgets/createResizePanel';
import createTabbedPanel from 'dojo-widgets/createTabbedPanel';
import createTextInput from 'dojo-widgets/createTextInput';
import createWidget from 'dojo-widgets/createWidget';
import projector from 'dojo-widgets/projector';
import { Child } from 'dojo-widgets/mixins/createParentMixin';
import createAction from 'dojo-actions/createAction';

import App from 'dojo-app/App';

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
app.registerStore('widgets', createMemoryStore({
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
}));

app.registerStore('actions', createMemoryStore({
	data: [
		{ id: 'close-tab', canClose: false, enabled: true },
		{ id: 'can-close-tab', enabled: true }
	]
}));

const widgets: Child[] = [];

/**
 * A header widget
 */
const header = createWidget({
	id: 'header',
	stateFrom: app.getStore('widgets'),
	tagName: 'h1'
});

widgets.push(header);

const tabbedPanel = createTabbedPanel({
	id: 'tabbed-panel',
	stateFrom: app.getStore('widgets')
});

widgets.push(tabbedPanel);

const tab1 = createPanel({
	id: 'tab-1',
	stateFrom: app.getStore('widgets')
});

tabbedPanel.append(tab1);

const layoutContainer = createLayoutContainer({
	id: 'layout-container',
	stateFrom: app.getStore('widgets')
});

tab1.append(layoutContainer);

projector.append(widgets);

const panelFixed = createPanel({
	id: 'panel-fixed',
	stateFrom: app.getStore('widgets')
});

layoutContainer.append(panelFixed);

const panelResize = createResizePanel({
	id: 'panel-resize',
	stateFrom: app.getStore('widgets')
});

panelFixed.append(panelResize);

/**
 * Button will remove item from list
 */
const removeButton = createButton({
	id: 'remove',
	stateFrom: app.getStore('widgets')
});

panelResize.append(removeButton);

/**
 * A widget for collecting the value of the list
 */
const firstName = createTextInput({
	id: 'first-name',
	stateFrom: app.getStore('widgets')
});

panelResize.append(firstName);

/**
 * A widget that will add the value to the list
 */
const addButton = createButton({
	id: 'add',
	stateFrom: app.getStore('widgets')
});

panelResize.append(addButton);

/**
 * The list widget
 */
const list = createList({
	id: 'list',
	stateFrom: app.getStore('widgets')
});

panelFixed.append(list);

const tab2 = createPanel({
	id: 'tab-2',
	stateFrom: app.getStore('widgets')
});

tabbedPanel.append(tab2);

tab2.append(createWidget({
	id: 'tab-2-content',
	stateFrom: app.getStore('widgets'),
	tagName: 'div'
}));

const tab3 = createPanel({
	id: 'tab-3',
	stateFrom: app.getStore('widgets')
});

tabbedPanel.append(tab3);

tab3.append(createWidget({
	id: 'tab-3-content',
	stateFrom: app.getStore('widgets'),
	tagName: 'div'
}));

const canCloseButton = createButton({
	id: 'can-close',
	stateFrom: app.getStore('widgets')
});

tab3.append(canCloseButton);

/**
 * An action that will pop an item from the list item and patch the items into the widgetstore
 */
app.registerAction('pop-list', createAction({
	do() {
		listItems.pop();
		return app.getStore('widgets').patch({ id: 'list', items: listItems });
	}
}));

/**
 * Connect the buttons onclick to the action
 */
removeButton.on('click', app.getAction('pop-list'));

/**
 * An action that will take the value from the text input, push it onto the list and patch
 * the widget store
 */
app.registerAction('push-list', createAction({
	do() {
		const label = firstName.value;
		listItems.push({ id: listItems.length, label: label });
		const widgets = <MemoryStore<Object>> app.getStore('widgets');
		return widgets.patch({ id: 'list', items: listItems }) /* patch the list */
			.patch({ id: 'first-name', value: label }); /* patch the value of fisrt-name */
	}
}));

/**
 * Connect the buttons onclick to the action
 */
addButton.on('click', app.getAction('push-list'));

app.registerAction('close-tab', createAction({
	do(options) {
		if (options && options.event && !this.state.canClose) {
			(<any> options.event).preventDefault();
			return app.getStore('widgets').patch({ label: 'I said you can\'t close me' }, { id: 'tab-3-content' });
		}
	}
}));
app.getAction('close-tab').observeState('close-tab', app.getStore('actions'));
tab3.on('close', app.getAction('close-tab'));

app.registerAction('can-close-tab', createAction({
	do() {
		return app.getStore('actions').patch({ canClose: true }, { id: 'close-tab' })
			.then(() => app.getStore('widgets').patch({ label: 'Now you can close the tab!!!' }, { id: 'tab-3-content'}));
	}
}));
canCloseButton.on('click', app.getAction('can-close-tab'));

/**
 * Attach the VDOM
 */
projector.attach();
