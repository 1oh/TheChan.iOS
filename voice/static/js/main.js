window.onload = function () {

	/**
	 * Requests component
	 */
	Vue.component('requests-section', {

		template: '#requests-template',

		props: ['type', 'title'],

		data: function () {
			return {
				requests: [],
				error: false,
				loaded: false,
				api: {
					requests: 'https://thevoice.yuriy.gr/requests/',
					vote: 'https://thevoice.yuriy.gr/vote/'
				},
				newRequest: '',
				lengthLimit: 255
			}
		},

		mounted: function () {
			this.fetchRequests(this.type);
		},

		computed: {
			newRequestLength: function () {
				return this.newRequest.length;
			}
		},

		methods: {
			fetchRequests: function (type) {

				this.$http.get(this.api.requests + type)
				.then(function(response) {
					if (response.body.status === 'success')
						this.requests = response.body.requests;
	
					if (response.body.status === 'error')
						console.error(response.body.message);
				})
				.catch(function() {
					this.error = true;
				})
				.finally(function() {
					this.loaded = true;
				});
			},
			submitVote: function (id, event) {
				event.preventDefault();

				event.target.disabled = true;

				this.$http.post(this.api.vote + id)
				.then(function(response) {
					if (response.body.status === 'success')
						event.target.innerText = response.body.request.vote + ' ▲';
	
					if (response.body.status === 'error')
						console.error(response.body);
				})
				.catch(function(error) {
					console.error(error);
				})
				.finally(function() {
					event.target.disabled = false;
				});
			},
			submitRequest: function (newRequest, event) {
				event.preventDefault();

				event.target.disabled = true;

				this.$http.post(this.api.requests + newRequest)
				.then(function(response) {
					if (response.body.status === 'success')
						this.requests.unshift(response.body.request);
	
					if (response.body.status === 'error')
						console.error(response.body);
				})
				.catch(function(error) {
					console.error(error);
				})
				.finally(function() {
					event.target.disabled = false;
					this.newRequest = '';
				});
			}
		}

	});

	/**
	 * Main application
	 */
	var app = new Vue({

		el: '#app',

		http: {
			options: {
				emulateJSON: true,
				emulateHTTP: true
			}
		},

		created: function () {
			// Ну вообще юмор
			console.info('Мамкин хакер сильно?');
		}
	});

}