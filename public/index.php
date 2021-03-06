<!DOCTYPE html>
<html>
    <meta charset="UTF-8">
    <head>
        <title>AXTimer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="style/colours1.css">
        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
        <link rel="icon" type="image/png" href="img/favicon-32x32.png" sizes="32x32" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.42/css/uikit.min.css" />
        <link rel="stylesheet" href="style/spectrum.css"/>
        <script src="scripts/scrambles/lib/raphael-min.js"></script>
        <script src="scripts/scrambles/scramble_333.js"></script>
        <script src="scripts/scrambles/scramble_222.js"></script>
        <script src="scripts/scrambles/scramble_NNN.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/4.3.0/math.js"></script>
        <script src="scripts/plugins/mousetrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/decimal.js/10.0.0/decimal.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.42/js/uikit.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.0-beta.42/js/uikit-icons.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
    </head>
    <body>
        <div id="generalModal" uk-modal>
            <div class="uk-modal-dialog uk-modal-body ">
                <h2 class="uk-modal-title">Headline</h2>
                <ul class="uk-subnav uk-subnav-divider" uk-margin>
                    <li class="uk-active"><a href="#" id="a1">General</a></li>
                    <li><a href="#" id='a2'>Stats</a></li>
                    <li><a href="#" id="a3">Keyboard shortcuts</a></li>
                </ul>
                <form id="generalForm">
                    <h1>STUFF</h1>
                </form>
                <form id="statsForm">
                    <label for="decimalsInput">Number of decimals displayed</label>
                    <select class="uk-select" id="decimalsInput">
                        <option selected>2</option>
                        <option>3</option>
                    </select>
                    <br>
                    <br>
                    <label for="avgCalc">Averages calculated, separated by commas</label>
                    <input type="text" id="avgCalc" class="uk-input"></input>
                    <br>
                    <br>
                    <div class="uk-grid">
                        <div class="uk-width-1-2">
                            <label for="tableAvg">First average displayed in table</label>
                            <input list="tableList" class="uk-input" id="tableAvg">
                            <datalist id="tableList"></datalist>
                        </div>
                        <div class="uk-width-1-2">
                            <label for="tableAvg1">Second average displayed in table</label>
                            <input list="tableList1" class="uk-input" id="tableAvg1">
                            <datalist id="tableList1"></datalist>
                        </div>
                    </div>
                    <br>
                    <p class="uk-text-right">
                        <button class="uk-button uk-button-default" type="submit">Save and Exit</button>
                        <button class="uk-button uk-button-default uk-modal-close" type="button">Exit</button>
                    </p>
                </form>
                <table class="uk-table" id="shortcutsTable">
                    <tr>
                        <th>Shortcut</th>
                        <th>Key combo</th>
                        <th>Usage</th>
                    </tr>
                    <tr>
                        <td>Typing/Timer</td>
                        <td>Ctrl+Enter</td>
                        <td>Switching between virtual timer and entering the times manually</td>
                    </tr>
                    <tr>
                        <td>Open/close Menu</td>
                        <td>Ctrl+M</td>
                        <td>Opening and closing the general menu</td>
                    </tr>
                    <tr>
                        <td>Open/close Colours Menu</td>
                        <td>C</td>
                        <td>Opening and closing the colours menu</td>
                    </tr>
                </table>
            </div>
        </div>
        <div id="colourModal" class="uk-modal-container" uk-modal bg-close="false">
            <div class="uk-modal-header uk-modal-dialog">
                <h2 class="uk-modal-title">Customization</h2>
            </div>
            <div class="uk-modal-dialog uk-modal-body uk-padding">
                <form  id="colourForm" class="uk-form-stacked">
                    <label for="whatDiv">Which container></label>
                    <select id="whatDiv" class="uk-select">
                        <option value="ScrambleHeader" selected>Scramble</option>
                        <option value="tableContainer">Table</option>
                        <option value="timeContainer">Time</option>
                        <option value="scrambleContainer">Scramble draw</option>
                        <option value="graph">Graph</option>
                        <option value="runningtimeContainer">Running timer</option>
                    </select>
                    <br>
                    <br>
                    <label for="mainColour">Colour?</label>
                    <input id="mainColour" class="uk-input uk-form-width-large uk-form-small"></input>
                    <input id="mainColourB"></input>
                    <hr class="uk-divider-icon">
                    <div class="uk-grid-collapse" uk-grid>
                        <div class="uk-width-1-2">
                            <label for="fontColour" class="uk-form-label">Font Colour?</label>
                            <input id="fontColour" type="text" class="uk-input uk-form-width-medium uk-form-small"></input>
                            <input id="fontColourB"></input>
                        </div>
                        <div class="uk-width-1-2" id="leftFontSize">
                            <label for="fontRange" class="uk-form-label">Font Size?</label>
                            <input id="fontRange" class="uk-range" type="range" value="16" min="0" max="40" step="0.5" oninput="this.form.fontInt.value=this.value"></input>
                            <input id="fontInt" type="number" type="range" value="16" min="0" max="40" step="0.5" oninput="this.form.fontRange.value=this.value"></input>
                        </div>
                    </div>
                    <br>
                    <label for="border">Border?</label>
                    <div id="border" class="uk-form-controls">
                        <input class="uk-radio" name="borderRadio" value="true" type="radio" checked onclick="document.getElementById('borderR').style.display='block'">Yes</input>
                        <input class="uk-radio" name="borderRadio" value="false" type="radio" onclick="document.getElementById('borderR').style.display='none'">No</input>
                        <div id="borderR">
                            <div class="uk-margin">
                                <input id="borderRange" class="uk-range" type="range" value="1" min="0" max="10" step="0.5" oninput="this.form.borderInt.value=this.value"></input>
                                <input id="borderInt" type="number" type="range" value="1" min="0" max="10" step="0.5" oninput="this.form.borderRange.value=this.value"></input>
                            </div>
                        </div>
                    </div>
                    <br>
                    <label for="gradient">Gradient?</label>
                    <div id="gradient" class="uk-form-controls">
                        <input class="uk-radio" name="gradientRadio" type="radio" value="true" onclick="document.getElementById('gradientDir').style.display='block'">Yes</input>
                        <input class="uk-radio" name="gradientRadio" type="radio" value="false" checked onclick="document.getElementById('gradientDir').style.display='none'">No</input>
                        <div id="gradientDir" style="display:none;">
                            <div class="uk-margin">
                                <label for="whatDir">To what direction?</label>
                                <select id="whatDir" class="uk-select">
                                    <option value="to bottom" selected>Top to bottom</option>
                                    <option value="to right">Left to right</option>
                                    <option value="to left">Rght to left</option>
                                    <option value="to top">Bottom to top </option>
                                </select>
                                <br>
                                <br>
                                <div class="uk-grid-collapse" uk-grid>
                                    <div class="uk-width-1-2">
                                        <label for="gradientC1">First colour></label>
                                        <input id="gradientC1" type="text" class="uk-input uk-form-width-medium uk-form-small"></input>
                                        <input id="gradientC1B"></input>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <label for="gradientC2">Second colour</label>
                                        <input id="gradientC2" type="text" class="uk-input uk-form-width-medium uk-form-small"></input>
                                        <input id="gradientC2B"></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="uk-button-group uk-margin">
                        <button id="coloursSubmit"class="uk-button uk-button-default uk-button-small">Save</button>
                        <button id="showChanges" class="uk-button uk-button-default uk-button-small">Show</button>
                        <button id="coloursDiscard" class="uk-button uk-button-default uk-button-small">Discard</button>
                    </div>
                </form>
            </div>
		</div>
		<div id="solveModal" class="uk-modal-container" uk-modal>
				<div class="uk-modal-header uk-modal-dialog">
						<h2 class="uk-modal-title">Solve Info</h2>
					</div>
			<div id="solveContent"class="uk-modal-dialog uk-modal-body uk-padding"></div>
		</div>
        <section id="main">
            <div id="ScrambleHeader" class="scroll">
                <h1 id="scramble" class="uk-text-center uk-text-middle uk-margin-remove">Loading...</h1>
                <button id="goBack" class="uk-button uk-button-primary uk-align-right" style="display:none;">Go back</button>
            </div>
            <div class="uk-grid-collapse  uk-margin-remove" uk-grid>
                <div class="uk-width-1-4 scroll" id="tableContainer">
                    <table class="uk-table uk-table-divider uk-table-justify uk-table-small uk-text-center" id="Timetable">
                        <tr>
                            <th class="uk-text-center">ID</th>
                            <th class="uk-text-center">Time</th>
                            <th class="uk-text-center" id="tableTh1">Ao5</th>
                            <th class="uk-text-center" id="tableTh2">Ao12</th>
                        </tr>
                    </table>
                </div>
                <div class="uk-width-3-4">
                    <div class="uk-grid-collapse uk-text-center" id="eh" uk-grid>
                        <div class="uk-width-1-2" id="timeContainer">
                            <form id="VirtualPenalty">
                                <div>
                                    <div uk-form-custom="target: true">
                                        <select id="VirtualOptions">
                                            <option value="0">OK</option>
                                            <option value="1">+2</option>
                                            <option value="-1">DNF</option>
                                            <option value=2>Del</option>
                                        </select>
                                        <h1 style="color:#333333"></h1>
                                    </div>
                                </div>
                            </form>                            
                            <h1 id="time"class="uk-margin-left uk-margin-right">00:00</h1>
                            <form id="CubeUsed">
                                <div>
                                    <div uk-form-custom="target: true">
                                        <select id="cube">
                                            <option value="222">2x2</option>
                                            <option value="333">3x3</option>
                                            <option value="444">4x4</option>
                                            <option value="555">5x5</option>
                                            <option value="666">6x6</option>
                                            <option value="777">7x7</option>
                                            <option value="333bf">3BLD</option>
                                            <option value="444bf">4BLD</option>
                                            <option value="555bf">5BLD</option>
                                        </select>
                                        <h1 style="color:#333333"></h1>
                                    </div>
                                </div>
                            </form>
                            <form id="InputTimes">  
                                <div class="uk-grid-collapse" uk-grid>
                                	<div class="uk-width-1-3">
                                        <select id="cubeTyping" class="uk-select uk-form">
                                            <option value="222">2x2</option>
                                            <option value="333">3x3</option>
                                            <option value="444">4x4</option>
                                            <option value="555">5x5</option>
                                            <option value="666">6x6</option>
                                            <option value="777">7x7</option>
                                            <option value="333bf">3BLD</option>
                                            <option value="444bf">4BLD</option>
                                            <option value="555bf">5BLD</option>
										</select>	
									</div>  
									<div class="uk-width-1-3">																					
											<input id="TimeType" class="uk-input uk-form-width-medium"></input>											
									</div>
                                    <div class="uk-width-1-3">
                                    	<select id="SolveOption" class="uk-select">
											<option value=0>OK</option>
											<option value=1>+2</option>
											<option value=-1>DNF</option>
											<option value=2>Del</option>
										</select>			
                                	</div>   
                            	</div>                                                                     
                            </form>
                        </div>
                        <div class="uk-width-1-2" id="scrambleContainer">
                            <div id="scrambleSVG"></div>
                        </div>
                    </div>
                    <div id="graph">
                        <canvas id="chart"></canvas>
                    </div>
                </div>
            </div>
        </section>
        <div id="runningtimeContainer">
            <h1 class="uk-text-center uk-position-center" id="runningtime"></h1>
        </div>
        <script type="module" src="scripts/timer.js"></script>
    </body>
</html>
