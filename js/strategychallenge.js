// Create Global Variable for this page.
var oGlobals = {};

$(document).ready(function() {
    oGlobals.submitMax = 3;
    oGlobals.timer = false;
    oGlobals.totaltime = 600; //seconds
    oGlobals.questions = 0;
    oGlobals.corrects = 0;
    oGlobals.points = 0;
    oGlobals.money = 0;
    
//    oGlobals.level = parseInt(getParameterByName("level"));
//    if (!oGlobals.level) { 
        oGlobals.level = 1; 
//        }
    
    createIntro();
        
});


    function createIntro() {
       var cDesc = "";
        cDesc += "<p><span class='h4'>Strategy Challenge</span></p>";
        cDesc +=  "<p>This 10-minute challenge gives you a set of option and / or future transaction(s) and for which you are required to calculate the profit/loss in the event that the settlement price of the underlying is as per the given scenarios.</p>"
        cDesc +=  "<p>Answering the questions correctly fetches you points. Higher points advance you to the next level and higher levels often provide the opportunity to fetch higher points.</p>";
        cDesc +=  "<p>Correctly answered questions also earn you as much money converted into profit. Wrongly answered questions get converted into your losses. Get bonus minutes for every 5000 currency earned.</p>";
        
        $("#divdescription").html(cDesc);
        var btnStart =  "<input id='btnStart' class='btn btn-primary' type='submit' value='Start &raquo;' onclick='startChallenge();' />";
        $("#divdescription").append(btnStart);
    }

    function startChallenge() {
        //$("#divintro").hide();    
        oGlobals.submitMax = 1;
        oGlobals.timer = true;        
        oGlobals.remainingtime = oGlobals.totaltime;
        // var displaytime = (parseInt(oGlobals.remainingtime/60)).toString() + ":" + (oGlobals.remainingtime%60).toString()
        // $("#lbltimer").text(displaytime);
        oGlobals.starttime = parseInt((new Date()).getTime()/1000); //gets current seconds since Jan 1970.
        oGlobals.timerhandle = setInterval(function() {timertick()},500);
                                                         
        createDescription();
        createScores();

        createNewQuestion();
    }


    function timertick() {
        oGlobals.currenttime = parseInt((new Date()).getTime()/1000);
        oGlobals.remainingtime = oGlobals.totaltime - (oGlobals.currenttime - oGlobals.starttime);
        var mm = (parseInt(oGlobals.remainingtime/60)).toString();
        var ss = (oGlobals.remainingtime % 60).toString();
        var displaytime = mm + ":" + ("0"+ss).substr(ss.length+1-2);
        $("#lbltimer").text(displaytime);
        if (oGlobals.remainingtime <= 0)
        {
                oGlobals.remainingtime = 0;
                clearInterval(oGlobals.timerhandle);
                $("#btnSubmit").hide();
                checkAnswers();
        }
    }
    
    function createNewQuestion() {
        // Reset Global variables.
        oGlobals.submitCount = 0;
        oGlobals.status = [];
        oGlobals.question = new elearnoptions.RandomQuestion("",oGlobals.level-1);
        // Compute difficulty
        oGlobals.lots = 0;
        for (var i=0; i<oGlobals.question.strategy.optionTransactions.length; i++) {
            oGlobals.lots += oGlobals.question.strategy.optionTransactions[i].quantity;
        }
        for (var i=0; i<oGlobals.question.strategy.futureTransactions.length; i++) {
            oGlobals.lots += oGlobals.question.strategy.futureTransactions[i].quantity;
        }
        
        
        
         oGlobals.question.strategy.optionTransaction
        
        
        for (var i=1; i<oGlobals.question.scenarios.length; i++)
            {   oGlobals.status[i] = false;
            }
        oGlobals.questions += 1;
        createTransTable(oGlobals.question.strategy);
        updateTable(oGlobals.question.strategy);
        createScenarioTable();
        updateScenarioTable(oGlobals.question);
        $('#txtAttempt0').focus();
    }

    
    
    function createDescription(tStrategy) {
        var cDesc = "";
        cDesc += "<p><span class='strategyname'>Strategy Challenge</span></p>";
        $("#divdescription").html(cDesc);

    }

    function createScores() {
        var cDesc = "";
        // Level section
        cDesc += "<p class='text-muted'>Level</p>";
        cDesc += "<div class='progress'>";
        cDesc += "  <div id='divlevel' class='progress-bar' role='progressbar' aria-valuenow='20' aria-valuemin='0' aria-valuemax='100' style='width: 20%;'>";
        cDesc += "  1";
        cDesc += "  </div>";
        cDesc += "</div>";
        cDesc += "<hr/>";
        

        cDesc += "<div class='row'>";
//        cDesc += "  <div class='col-xs-4  text-center text-muted'>";
//        cDesc += "      <p>Questions</p>";
//        cDesc += "      <p id='lblquestions' class='h3'>0</p>";
//        cDesc += "  </div>";
//        cDesc += "  <div class='col-xs-4  text-center text-muted'>";
//        cDesc += "      <p>Scenarios</p>";
//        cDesc += "      <p id='lblscenarios' class='h3'>0</p>";
//        cDesc += "  </div>";
//        cDesc += "  <div class='col-xs-4  text-center text-muted'>";
//        cDesc += "      <p>Correct</p>";
//        cDesc += "      <p id='lblcorrects' class='h3'>0</p>";
//        cDesc += "  </div>";
        cDesc += "  <div class='col-xs-4  text-center text-primary'>";
        cDesc += "      <p>Points</p>";
        cDesc += "      <p id='lblpoints' class='h3'>0</p>";
        cDesc += "  </div>";
        cDesc += "  <div class='col-xs-4  text-center text-primary'>";
        cDesc += "      <p>Time</p>";
        cDesc += "      <p id='lbltimer' class='h3'>10:00</p>";
        cDesc += "  </div>";
        cDesc += "  <div class='col-xs-4  text-center text-primary'>";
        cDesc += "      <p>Money</p>";
        cDesc += "      <p id='lblmoney' class='h3'>0</p>";
        cDesc += "  </div>";
        cDesc += "</div>";
        
                        
        $("#divscores").html(cDesc);
    }
    function createTransTable(tStrategy) {
   	    var divTrans = $("#divtrans");

        if (tStrategy.optionLegs > 0) {
            var rowHtml  = "";
            rowHtml  += "<p class='h4'>Option Transactions</p>";
            rowHtml  += "<table id='tableoptiontrans' class='table table-condensed'>";
            rowHtml  += "   <thead>";
            rowHtml  += "       <tr>";
            rowHtml  += "           <th>Sl</th>";
            rowHtml  += "           <th>Opt</th>";
            rowHtml  += "           <th>Trans</th>";
            rowHtml  += "           <th>Strike</th>";
            rowHtml  += "           <th>Qty</th>";
            rowHtml  += "           <th>Premium</th>";
            rowHtml  += "       </tr>";
            rowHtml  += "   </thead>";
            rowHtml  += "   <tbody id='tableoptiontransbody'>";
            rowHtml  += "   </tbody>";
            rowHtml  += "</table>";
            divTrans.html(rowHtml);
        
    	    var tbo = $("#tableoptiontransbody");
        
    	    // Add Placeholder Rows and Premium Slider for each Option Leg in Strategy.
    	    for (var i=0;i<tStrategy.optionLegs;i++) {
    	        // var row = tStrategy.optionTransactions[i];
    	        var rowHtml = "<tr>";
    	        rowHtml += "<td>" + (i+1).toString() + "</td>"; //Serial Number
    	        rowHtml += "<td>&nbsp;</td>"; // Ref Option Type
    	        rowHtml += "<td>&nbsp;</td>"; // Ref Transaction Type
    	        rowHtml += "<td>&nbsp;</td>"; // Strike Price
    	        rowHtml += "<td>&nbsp;</td>"; // Quantity
    	        var premval = tStrategy.refPremium[i];
    	        rowHtml += "<td><span id='lblPremium" + i.toString() +  "'>"  + premval.toString() + "</span></td>"; // Premium
    	        //rowHtml += "<td><input id='txtPremium" + i.toString() + "' type='range' min='0' max='100' step='5' value='"  + premval.toString() + "' onChange='updateAll();' /></td>"; // Premium Slider
    	        rowHtml += "</tr>";
    	        tbo.append(rowHtml);
            };
        };
        
        if (tStrategy.futureLegs > 0) {
            var rowHtml  = "";
            rowHtml  += "<p class='h4'>Future Transactions</p>";
            rowHtml  += "<table id='tablefuturetrans' class='table table-condensed'>";
            rowHtml  += "   <thead>";
            rowHtml  += "       <tr>";
            rowHtml  += "           <th>Sl</th>";
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Trans</th>";
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Qty</th>";
            rowHtml  += "           <th>Future Price</th>";
            rowHtml  += "       </tr>";
            rowHtml  += "   </thead>";
            rowHtml  += "   <tbody id='tablefuturetransbody'>";
            rowHtml  += "   </tbody>";
            rowHtml  += "</table>";
            divTrans.append(rowHtml);

            var tbf = $("#tablefuturetransbody");
           
    	    // Add Placeholder Rows and Premium Slider for each Option Leg in Strategy.
    	    for (var i=0;i<tStrategy.futureLegs;i++) {
    	        // var row = tStrategy.optionTransactions[i];
    	        var rowHtml = "<tr>";
    	        rowHtml += "<td>" + (i+1).toString() + "</td>"; //Serial Number
    	        rowHtml += "<td>&nbsp;</td>"; // Empty
    	        rowHtml += "<td>&nbsp;</td>"; // Transaction Type
    	        rowHtml += "<td>&nbsp;</td>"; // Empty
    	        rowHtml += "<td>&nbsp;</td>"; // Quantity
    	        rowHtml += "<td>" + tStrategy.refFuturePrice.toString() + "</td>"; // Future Price
        	    
    	        rowHtml += "</tr>";
    	        tbf.append(rowHtml);
            }
        }        
    }

    function updateTable(tStrategy) {
   
    	// Update all option Transactions
    	for (var i=0;i<tStrategy.optionTransactions.length;i++) {
    	    var row = tStrategy.optionTransactions[i];
    	    var tds = $('#tableoptiontransbody tr:eq(' + i.toString() + ')').children('td');
    	    tds.eq(1).text(row.optionType.name);
    	    tds.eq(2).text(row.transactionType.name);
    	    tds.eq(3).text(row.strikePrice.toString());
    	    tds.eq(4).text(row.quantity.toString());
    	    tds.eq(5).text(row.premium.toString());
        };
        
    	// Update all future Transactions
    	for (var i=0;i<tStrategy.futureTransactions.length;i++) {
    	    var row = tStrategy.futureTransactions[i];
    	    var tds = $('#tablefuturetransbody tr:eq(' + i.toString() + ')').children('td');
    	    tds.eq(2).text(row.transactionType.name);
    	    tds.eq(4).text(row.quantity.toString());
    	    tds.eq(5).text(row.price.toString());
        };
    }

    function createScenarioTable() {
        // Generate Table Headers
    	var divScenarios = $("#divscenarios");
        var rowHtml  = "";
        rowHtml  += "<p class='h4'>Scenarios on Settlement</p>";
        rowHtml  += "<table id='tablevar' class='table table-condensed'>";
        rowHtml  += "    <thead>";
        rowHtml  += "        <tr>";
        rowHtml  += "            <th>Sl</th>";
        rowHtml  += "            <th>Price</th>";
        rowHtml  += "            <th>Calculate P/L</th>";
        rowHtml  += "            <th>Result</th>";
        rowHtml  += "            <th>Answer</th>";
        rowHtml  += "        </tr>";
        rowHtml  += "    </thead>";
        rowHtml  += "    <tbody id='tablescenariobody'>";
        rowHtml  += "    </tbody>";
        rowHtml  += "</table>";
        divScenarios.html(rowHtml);
        
        var btnSubmit = "<button id='btnSubmit' type='submit' class='btn btn-success' onclick='checkAnswers();'>Submit  &raquo;</button>"
        divScenarios.append(btnSubmit+"&nbsp;");
        
        var btnNext = "<button id='btnNext' type='submit' class='btn btn-primary pull-right hide' onclick='createNewQuestion();'>Next  &raquo;</button>"
        divScenarios.append(btnNext);
    }

    function updateScenarioTable(tQues) {
    	var tableScenarioBody = $("#tablescenariobody");
        for (var i=0; i< tQues.scenarios.length; i++) {
    	    var rowHtml  = "";
            rowHtml  += "<tr>";
            rowHtml  += "   <td>" + (i+1).toString() + "</td>";
            rowHtml  += "   <td>" + tQues.scenarios[i].toString() + "</td>";
            rowHtml  += "   <td><input  id='txtAttempt" + i.toString() + "' onkeypress='return blockKeys(this,event);' onblur='validateAttempt(" + i.toString() + ")' style='width:98%;' />";
            rowHtml  += "   <td>&nbsp;</td>";
            rowHtml  += "   <td>&nbsp;</td>";
        
            rowHtml  += "</tr>";
    	    tableScenarioBody.append(rowHtml);
        }
    }
    
    function validateAttempt(i) {
        var nAttemptText = $('#txtAttempt'+i.toString()).val();
        var tds = $('#tablescenariobody tr:eq(' + i.toString() + ')').children('td');
        try {
            var nAttempt = eval(nAttemptText);
            tds.eq(3).text(nAttempt);
            }
        catch(err) {
            tds.eq(3).html("<span title='Invalid expression' class='glyphicon glyphicon-warning-sign text-warning'></span>");
 
        }
    }

    function checkAnswers() {
        oGlobals.submitCount += 1;
       
        for (var i=0; i<oGlobals.question.scenarios.length; i++) {
            if (!oGlobals.status[i]) {
                var tds = $('#tablescenariobody tr:eq(' + i.toString() + ')').children('td');
                var nAns = oGlobals.question.strategy.getProfitLoss(oGlobals.question.scenarios[i]);
                var nAttemptText = $('#txtAttempt'+i.toString()).val();
                var nAttempt = "";
                try {
                    nAttempt = eval(nAttemptText);
                    }
                catch(err) {
                    nAttempt = ""; //reset to empty string
                }
               
                if (nAns === nAttempt) { 
                    tds.eq(4).append("<span class='glyphicon glyphicon-ok text-success'></span>");
                    $('#txtAttempt'+i.toString()).attr('readonly','true');
                    $('#txtAttempt'+i.toString()).css('background-color','#CFC');
                    oGlobals.status[i]=true;
                    oGlobals.corrects += 1;
                    // Points on correct answer - number of legs * 100
                    oGlobals.points += (100*oGlobals.lots); // 100 points per lot.
                    // Earn money
                    oGlobals.money += Math.abs(nAns);
                    
                      }
                else {
                    oGlobals.status[i]=false;
                    tds.eq(4).append("<span class='glyphicon glyphicon-remove text-danger'></span>");
                    // if chances over and still incorrect - reveal answer  
                    if (oGlobals.submitCount >= oGlobals.submitMax) {
                        $('#txtAttempt'+i.toString()).attr('readonly','true');
                        $('#txtAttempt'+i.toString()).css('background-color','#FCC');
                        // tds.eq(3).html("<span class='text-danger'>" + nAttempt.toString() + "</span>");
                        tds.eq(4).html("<span class='text-success'>" + nAns.toString() + "</span>");                    }
                        
                        // lose money
                        oGlobals.money -= Math.abs(nAns);
                        
                }
            }
        }


        // Level Advance - if applicable
        if ((oGlobals.points >= 500) && (oGlobals.level = 1)) {oGlobals.level = 2;}
        if ((oGlobals.points >= 1500) && (oGlobals.level = 2)) {oGlobals.level = 3;}
        if ((oGlobals.points >= 3000) && (oGlobals.level = 3)) {oGlobals.level = 4;}
        if ((oGlobals.points >= 5000) && (oGlobals.level = 4)) {oGlobals.level = 5;}

        //Give bonus time if 5000 points. //pending - show alert
        while (oGlobals.money >= 5000) { 
            oGlobals.totaltime += 60;
            oGlobals.money -= 5000; 
            }

        var allowNext = false;
        // find first false status
        var nIndexOfWrong = oGlobals.status.indexOf(false);
        // if all correct permit next
        if (nIndexOfWrong == -1) {
            allowNext = true;
        } 
                
        // disable submit
        if (oGlobals.submitCount >= oGlobals.submitMax ) {
            allowNext = true;
        }
        
        if ((oGlobals.timer) && (oGlobals.remainingtime == 0)) {
            allowNext = false;
        }
        
        if (allowNext) {
            $('#btnSubmit').hide();
            // $('#btnNext').removeClass('hide');
            // $('#btnNext').focus();
            // For each wrong answer - Show Answer and mark disabled.
            setTimeout(function() {createNewQuestion()},500);
        }
       else {
            $('#txtAttempt'+nIndexOfWrong.toString()).focus();
        }    
    
        //update scores
        updateScores();    
    }
    
    function updateScores() {
//        $("#lblquestions").text(oGlobals.questions.toString());
//        $("#lblscenarios").text((oGlobals.questions*3).toString());
//        $("#lblcorrects").text(oGlobals.corrects.toString());
        $("#lblpoints").text(oGlobals.points.toString());
        $("#lblmoney").text(oGlobals.money.toString());
        
        // Level
        $("#divlevel").text(oGlobals.level);
        var levelpercent = ((oGlobals.level*100)/5).toString();
        $("#divlevel").attr("style","width: " + levelpercent + "%;");
        $("#divlevel").attr("aria-valuenow",levelpercent);
        
        
    }
    
    function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    function blockKeys(obj, e)
    {
	    var key;
	    var isCtrl = false;
	    var keychar;
	    var reg;
	    var allowedKeys = "0123456789+-*().";
	    
	    if(window.event) {
		    key = e.keyCode;
		    isCtrl = window.event.ctrlKey
	    }
	    else if(e.which) {
		    key = e.which;
		    isCtrl = e.ctrlKey;
	    }
    	
    	
	    // check for backspace or delete, or if Ctrl was pressed
	    if (key == 8 || isCtrl)
	    {
		    return true;
	    }
        // Convert key pressed into Char and find if it exists in allowedKeys converted into array.            
	    keychar = String.fromCharCode(key);
        return (allowedKeys.split("").indexOf(keychar) >= 0) 
    }
// return blockNonNumbers(this, event,false , true);
        