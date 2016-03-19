# dojo-app-example

This is a prototype example application for Dojo 2.

## Features

The main purpose of this prototype is to show how a Dojo 2 Application leverages components of Dojo 2 to
build a holistic application.  It leverages several packages to provide the entire application:

* [dojo/loader](https://github.com/dojo/loader) - an AMD/CommonJS loader
* [dojo/widgets](https://github.com/kitsonk/widgets) - UI controls for Dojo 2, which utilizes:
  * [MaquetteJS](http://maquettejs.org/) - a lightweight virtual DOM/hyperscript library
  * [RxJS 5](https://github.com/ReactiveX/RxJS) - an implementation of proposed ES Observables
  * [ImmutableJS](https://facebook.github.io/immutable-js/) - immutable collections
* [dojo/actions](https://github.com/dojo/actions) - a command API
* [dojo/core](https://github.com/dojo/core) - a functonal library plus key shims/polyfills

A version of the application is available, fully built [here](https://user.sitepen.com/~kkelly/app-example/_build/src/).

The application architecture which this is based on is documented in [Dojo 2 Application](https://docs.google.com/document/d/1Kgc99f8yTtZGopKr6OWGMjsJTV5hHNlr0ztWQS_cRnA/edit#)

&copy; 2016 Dojo Foundation & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.

