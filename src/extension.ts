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

'use strict';

import * as vscode from 'vscode';
import * as vscodelc from 'vscode-languageclient';

function getConfig< T >( option: string, defaultValue?: any ) : T
{
    let config = vscode.workspace.getConfiguration( 'casmd' );
    return config.get< T >( option, defaultValue );
}

let casmdClient : vscodelc.LanguageClient;
let casmdPath = getConfig< string >( 'path' );
let casmdArgs = getConfig< string[] >( 'arguments' );

// let delay = (time : any) => (result : any) => new Promise(resolve => setTimeout(() => resolve(result), time));

export function activate( context: vscode.ExtensionContext )
{
    let casm_mode = vscode.commands.registerCommand
    ( 'casm.language.mode', () =>
      {
        vscode.window.showInformationMessage( 'CASM: triggered language mode to load' );
      }
    );

    context.subscriptions.push( casm_mode );

    let serverOptions: vscodelc.ServerOptions =
    { command: casmdPath
    , args: casmdArgs
    };

    let clientOptions: vscodelc.LanguageClientOptions =
    { documentSelector : [ 'casm' ]
    , synchronize: {
        configurationSection: 'casmd',
        fileEvents: vscode.workspace.createFileSystemWatcher( '**/*.casm' )
      }
    };

    casmdClient = new vscodelc.LanguageClient
    ( 'casmd'
    , 'CASM Language Server Daemon'
    , serverOptions
    , clientOptions
    );

    casmdClient.onReady().then
    (() =>
    {
      console.log( 'CASM Language Server Daemon: ready' );
    });

    console.log( 'CASM Language Server Daemon: starting' );
    context.subscriptions.push( casmdClient.start() );
}
