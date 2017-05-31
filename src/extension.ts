//
//  Copyright (c) 2017 CASM Organization
//  All rights reserved.
//
//  Developed by: Philipp Paulweber
//                https://github.com/casm-lang/casm-lang.plugin.vscode
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
//
//  Copyright (c) Microsoft Corporation. All rights reserved.
//  Licensed under the MIT License. See License.txt in the project root for license information.
//





import * as path from 'path';
import * as process from 'child_process';
import * as vscode from 'vscode';
import * as vscodelc from 'vscode-languageclient';

/**
 * Method to get workspace configuration option
 * @param option name of the option (e.g. for casmd.path should be path)
 * @param defaultValue default value to return if option is not set
 */

function getConfig<T>(option: string, defaultValue?: any) : T {
    let config = vscode.workspace.getConfiguration('casmd');
    return config.get<T>(option, defaultValue);
}

/**
 *  this method is called when your extension is activate
 *  your extension is activated the very first time the command is executed
 */

export function activate( context: vscode.ExtensionContext )
{
    let casm_mode = vscode.commands.registerCommand
    ( 'casm.language.mode', () =>
      {
        vscode.window.showInformationMessage( 'CASM: triggered language mode to load' );
      }
    );
    
    context.subscriptions.push( casm_mode );

    
    let casmdPath = getConfig<string>( 'path' );
    let casmdArgs = getConfig<string[]>( 'arguments' );
    let casmdOpts = [ '' ];

    let serverOptions = () => new Promise< process.ChildProcess >
    ( ( resolve
      , reject
      ) =>
      {
	      function spawnServer( ...args: string[] ): process.ChildProcess 
          {
              let childProcess = process.spawn
              ( casmdPath
              , casmdArgs 
              );

              childProcess.stderr.on
              ( 'data', data => 
                {
				    console.warn( casmdPath + ': ' + data.toString() );
			    }
              );

              childProcess.stdout.on
              ( 'data', data => 
                {
				    console.log( casmdPath + ': ' + data.toString() );
			    }
              );

    		  childProcess.on
              ( 'error', error => 
                {
                    let regex = /ENOENT/gi;
                    if( error.message.search( regex ) != -1 ) 
                    {
                        vscode.window.setStatusBarMessage
                        ( "CASM: error: could not spawn process '" + casmdPath + "'" 
                        );
                    
                        console.error( error.message );
	    			    console.error
                        ( "Unable to execute '" 
                        + casmdPath 
                        + "' command. "
                        + "CASM language server is either not installed or not in the execution PATH."
                        );
                    }    
                    else
                    {
                        throw error;
                    }
                }
              );
              
              return childProcess; // Uses stdin/stdout for communication
          }

        //   try 
        //   {
              let casmdProcess = spawnServer();
              resolve( casmdProcess );
        //   }
        //   catch( error ) 
        //   {
        //       console.error( error );
        //   }
	  }
    );

	let clientOptions: vscodelc.LanguageClientOptions = 
    { documentSelector: 
      [ 'plaintext'
      , 'casm'
      ]
    , synchronize: 
      { configurationSection: 'casmLanguageClient'
      , fileEvents: vscode.workspace.createFileSystemWatcher( '**/*.casm' )
	  }
	}

    var casmLanguageClient = new vscodelc.LanguageClient
    ( 'casmLanguageClient'
    , 'CASM Language Server Protocol Client'
    , serverOptions
    , clientOptions
    ).start();

    context.subscriptions.push( casmLanguageClient );

    vscode.window.showInformationMessage( 'CASM Language Mode' );
}
