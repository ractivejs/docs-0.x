/* The one-size-fits-all key to Grunt.js happiness - http://bit.ly/grunt-happy */

/*global module:false*/
module.exports = function ( grunt ) {

	'use strict';

	var config, dependency;

	require( 'jit-grunt' )( grunt );

	config = {
		pkg: grunt.file.readJSON( 'package.json' ),
		latest: '0.7',
		edge: 'edge',
		prod: grunt.option( 'prod' ),

		// TODO do we need this?... probably not, it just got
		// copied and pasted in
        paths: {
            'shared': '../../shared',

            // libraries
            'ractive': 'lib/ractive',

            // loaders
            'amd-loader': 'loaders/amd-loader',
            'rvc': 'loaders/rvc'
        },

		nav: function ( selected ) {
			var partial = grunt.file.read( 'shared/partials/nav.html' );
            return grunt.template.process( partial, {
                data: { id: selected }
            });
		},
		analytics: function ( gaTrackingId, gaProperty ) {
			var partial = grunt.file.read( 'shared/partials/analytics.html' );
            return grunt.template.process( partial, {
                data: { gaTrackingId: gaTrackingId, gaProperty: gaProperty }
            });
		},
		head: grunt.file.read( 'shared/partials/head.html' ),
		footer: grunt.file.read( 'shared/partials/footer.html' ),

		getEditLink: function ( file ) {
			var source = grunt.editLinkReverseMapping[ file ];
			return 'https://github.com/ractivejs/v0.x/edit/master/docs/' + source;
		}
	};

	grunt.editLinkReverseMapping = {};

	// Read config files from the `grunt/config/` folder
	grunt.file.expand( 'grunt/config/*.js' ).forEach( function ( path ) {
		var property = /grunt\/config\/(.+)\.js/.exec( path )[1],
			module = require( './' + path );
		config[ property ] = typeof module === 'function' ? module( grunt ) : module;
	});

	// Initialise grunt
	grunt.initConfig( config );

	// Load development dependencies specified in package.json
	for ( dependency in config.pkg.devDependencies ) {
		if ( /^grunt-/.test( dependency) ) {
			grunt.loadNpmTasks( dependency );
		}
	}

	// Load tasks from the `grunt-tasks/` folder
	grunt.loadTasks( 'grunt/tasks' );

};
