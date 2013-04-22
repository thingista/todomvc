/*global Todos Ember */
'use strict';

Todos.TodosController = Ember.ArrayController.extend({
	createTodo: function () {
		// Get the todo title set by the "New Todo" text field
		var title = this.get('newTitle');
		if (!title.trim()) {
			return;
		}

		// Create the new Todo model
		Todos.Todo.createRecord({
			title: title,
			isCompleted: false
		});

		// Clear the "New Todo" text field
		this.set('newTitle', '');

		// Save the new model
		this.get('store').commit();
	},

	clearCompleted: function () {
		var completed = this.filterProperty('isCompleted', true);
		completed.invoke('deleteRecord');

		this.get('store').commit();
	},

	remaining: Ember.computed(function () {
		return Ember.A(this.filterProperty('isCompleted', false)).get('length');
	}).property('@each.isCompleted'),

	remainingFormatted: Ember.computed(function () {
		var remaining = this.get('remaining');
		var plural = remaining === 1 ? 'item' : 'items';
		return Ember.String.fmt('<strong>%@</strong> %@ left', remaining, plural);
	}).property('remaining'),

	completed: Ember.computed(function () {
		return Ember.A(this.filterProperty('isCompleted', true)).get('length');
	}).property('@each.isCompleted'),

	hasCompleted: Ember.computed(function () {
		return this.get('completed') > 0;
	}).property('completed'),

	allAreDone: Ember.computed(function (key, value) {
		if (value !== undefined) {
			this.setEach('isCompleted', value);
			return value;
		} else {
			return !!this.get('length') &&
				this.everyProperty('isCompleted', true);
		}
	}).property('@each.isCompleted')
});
