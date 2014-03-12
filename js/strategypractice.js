// Create Global Variable for this page.
var oGlobals = {};

$(document).ready(function() {
    oGlobals.submitMax = 3;
    oGlobals.questions = 0;
    oGlobals.corrects = 0;
    oGlobals.points = 0;
    
    oGlobals.strategyId = getParameterByName("id");
    createNewQuestion();
});

   
    function createNewQuestion() {
        // Reset Global variables.
        oGlobals.submitCount = 0;
        oGlobals.status = [];
        oGlobals.question = new elearnoptions.RandomQuestion(oGlobals.strategyId,4);
        for (var i=1; i<oGlobals.question.scenarios.length; i++)
            {   oGlobals.status[i] = false;
            }
        oGlobals.questions += 1;
        createDescription();
        createTransTable(oGlobals.question.strategy);
        updateTable(oGlobals.question.strategy);
        createScenarioTable();
        updateScenarioTable(oGlobals.question);
        $('#txtAttempt0').focus();
    }

    function createDescription() {
        var cDesc = "";
        cDesc += "<p><span class='h4'>Practice Exercises</span></p>";
        cDesc += "<p><span class='strategyname'>" + oGlobals.question.strategy.name + "</span></p>";
        cDesc +=  "<p>Given the set of option and / or future transaction(s), calculate the profit/loss in the event that the settlement price of the underlying is as per the given scenarios.</p>"
        $("#pagename").text(oGlobals.question.strategy.name);
        $("#divdescription").html(cDesc);
        
        var learnLink = "<p class='text-muted'><a class='navbar-link' href='strategylearn.html?id=" + oGlobals.question.strategy.id + "'>Learn about this Strategy</a></p>";
	    $("#divdescription").append(learnLink); // anti SEO - should happen at server side


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
                    oGlobals.points += 100; // May depend on complexity of question / name of strategy
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
                }
            }
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
        
       
        if (allowNext) {
            $('#btnSubmit').hide();
            $('#btnNext').removeClass('hide');
            $('#btnNext').focus();
            // For each wrong answer - Show Answer and mark disabled.
        }
       else {
            $('#txtAttempt'+nIndexOfWrong.toString()).focus();
        }    
    
        //update scores
        updateScores();    
    }
    
    function updateScores() {
        $("#lblquestions").text(oGlobals.questions.toString());
        $("#lblscenarios").text((oGlobals.questions*3).toString());
        $("#lblcorrects").text(oGlobals.corrects.toString());
        $("#lblpoints").text(oGlobals.points.toString());
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
        