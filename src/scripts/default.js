var config = {};

firebase.initializeApp(config);

var db = firebase.database(),
	auth = firebase.auth();

var app = new Vue({
	el: '.app',
	beforeCreate: function () {
        auth.onAuthStateChanged(function(user) {
            if (user) {
            	app.user.email = user.email;
            	app.user.isLogin = true;
                app.$bindAsArray('tasks', db.ref('table/' + user.uid));
            } else {
				app.user.email = null;
            	app.user.isLogin = false;
            }
        });
    },
	data: {
		newTask: null,
		email: null,
		password: null,
		user: {
			email: null,
			isLogin: false
		},
		tasks: null
	},
	methods: {
		addTask: function() {
			if(this.newTask.trim()) {
				this.$firebaseRefs.tasks.push({
					text: this.newTask,
					completed: false
				});
				this.newTask = '';
			}
		},
		removeTask: function(task) {
            this.$firebaseRefs.tasks.child(task['.key']).remove();
		},
		changeState: function(task) {
            this.$firebaseRefs.tasks.child(task['.key']).child('completed').set(!task.completed);
		},
		removeAllTasks: function() {
            this.$firebaseRefs.tasks.remove();
		},
		onLogin: function () {
            auth.signInWithEmailAndPassword(this.email, this.password).then(function (result) {
				app.email = null;
				app.password = null;
            }).catch(function(error) {
				alert(app.authError(error.code));
            });
        },
		onSignup: function () {
            auth.createUserWithEmailAndPassword(this.email, this.password).then(function(result) {
            	app.email = null;
            	app.password = null;
            }).catch(function(error) {
				console.log('Error method onSignup:', error.code);
			});
        },
		onSignout: function () {
            auth.signOut().catch(function(error) {
            	console.log('Error method onSignOut:', error.message);
            });
        },
		authError: function(code) {
			if (code === 'auth/user-not-found') {
				return 'User not found';
			} else if (code === 'auth/invalid-email') {
				return 'Invalid email';
			} else if (code === 'auth/wrong-password') {
				return 'Invalid password';
			} else if (code === 'auth/user-not-found') {
				return 'User is not found';
			} else if (code === 'auth/weak-password') {
				return 'Weak password';
			} else if (code === 'auth/email-already-in-use') {
				return 'This email already in use';
			} else {
				return 'Exception error';
			}
		}
	},
	computed: {
		countActive: function() {
			return this.tasks.filter(function(task) {
				return !task.completed;
			}).length;
		},
		countDone: function() {
			return this.tasks.filter(function(task) {
				return task.completed;
			}).length;
		}
	}
});
