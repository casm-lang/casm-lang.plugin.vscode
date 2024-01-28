//
//  Copyright (C) 2017-2024 CASM Organization <https://casm-lang.org>
//  All rights reserved.
//
//  Developed by: Philipp Paulweber et al.
//  <https://github.com/casm-lang/casm-lang.plugin.vscode/graphs/contributors>
//
//  This file is part of casm-lang.plugin.vscode.
//
//  casm-lang.plugin.vscode is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  casm-lang.plugin.vscode is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with casm-lang.plugin.vscode. If not, see <http://www.gnu.org/licenses/>.
//
//  Based on https://github.com/vscode-extension-samples/lsp-sample project:
//  Copyright (c) Microsoft Corporation. All rights reserved.
//  Licensed under the MIT License. See License.txt in the project root for license information.
//

var testRunner = require('vscode/lib/testrunner');

// You can directly control Mocha options by uncommenting the following lines
// See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for more info
testRunner.configure({
    ui: 'tdd', 		// the TDD UI is being used in extension.test.ts (suite, test, etc.)
    useColors: true // colored output from test results
});

module.exports = testRunner;
