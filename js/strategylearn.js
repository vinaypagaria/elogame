﻿    // Create Global Variable for this page.
     var MyGlobals = {};
	
//	$(function() {
//	});
	
	$(document).ready(function() {
	
         MyGlobals.strategy = new elearnoptions.Strategy();
         var id = getParameterByName("id");
         MyGlobals.strategy.initStrategy(id);
         createDescriptions();
         createVariableTable(MyGlobals.strategy);
         createTransTable(MyGlobals.strategy);
         // Sliders
        if( !Modernizr.inputtypes.range )
            {
              initSlider();
            };
         
         // Call Update Chart with Default values
         updateAll();
	
	});
	
	function initSlider() {           
        $('input[type=range]').each(function() {
            var $input = $(this);
            var $slider = $('<div id="slider__' + $input.attr('id') + '" data-originput="' + $(this).attr('id')  +  '" class="' + $input.attr('class') + '"></div>');
         
            $input.after($slider).hide();
                         
            $slider.slider({
                range:"min",
                min: parseInt($input.attr('min')),
                max: parseInt($input.attr('max')),
                step: parseInt($input.attr('step')),
                value: parseInt($input.attr('value')),
                slide: function(e, ui) {
                        $(this).val(ui.value);
                        //var orgInput =$("#"+$(this).attr('id').split("__")[1]) ;
                        var orgInput =$("#"+$(this).attr('data-originput')) ;
                        
                        orgInput.val(ui.value);
                        //alert(orgInput.val());
                        updateAll();
                        }
            });
        });
    };
	
	function createDescriptions() {
	    document.title = "eLearn " + MyGlobals.strategy.name + " Strategy";
	    $("#pagename").text(MyGlobals.strategy.name);
	    $("#divdescription").append(MyGlobals.strategy.description); // anti SEO - should happen at server side
        var practiceLink = "<p class='text-muted'><a class='navbar-link' href='strategypractice.html?id=" + MyGlobals.strategy.id + "'>Practice Exercises</a></p>";
	    $("#divdescription").append(practiceLink); // anti SEO - should happen at server side
	    
	}
	
    function createVariableTable(tStrategy) {
        // Generate Table Headers
    	var divVariables = $("#divvariables");
        var rowHtml  = "";
        rowHtml  += "<p class='h4'>Variables</p>";
        rowHtml  += "<table id='tablevar' class='table table-condensed'>";
        rowHtml  += "    <thead>";
        rowHtml  += "        <tr>";
        rowHtml  += "            <th>Description</th>";
        rowHtml  += "            <th colspan='2'>Value</th>";
        rowHtml  += "        </tr>";
        rowHtml  += "    </thead>";
        rowHtml  += "    <tbody id='tablevariablebody'>";
        rowHtml  += "    </tbody>";
        rowHtml  += "</table>";
        divVariables.append(rowHtml);

    	var tb = $("#tablevariablebody");
    	// Add Table Rows based on variables applicable for strategy.
        // ------------------- Ref Transaction Type                    	    
        if (tStrategy.isVarTransactionType) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Type</td>"; 
                rowHtml += "    <td colspan='2'>"; 
                rowHtml += "        <label class='radio-inline'><input type='radio' id='optLong' value='long' name='opttype' checked='checked' onChange ='updateAll()'>Long</label>"; // Ref Transaction Type
                rowHtml += "        <label class='radio-inline'><input type='radio' id='optShort' value='short' name='opttype' onChange ='updateAll()'>Short</label>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 
       
        if (tStrategy.isVarOptionType) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Option</td>"; 
                rowHtml += "    <td colspan='2'>"; 
                rowHtml += "        <label class='radio-inline'><input type='radio' id='optCall' value='call' name='optoption' checked='checked' onChange ='updateAll()'>Call</label>"; 
                rowHtml += "        <label class='radio-inline'><input type='radio' id='optPut' value='put' name='optoption' onChange ='updateAll()'>Put</label>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 

        if (tStrategy.isVarFuturePrice) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Future Price</td>"; 
                rowHtml += "    <td><span id='lblFuturePrice'>" + tStrategy.refFuturePrice.toString() + "</span></td>"; 
                rowHtml += "    <td>"; 
                rowHtml += "        <input class='slider' id='txtFuturePrice' type='range' min='4800' max='5200' step='50' value='" + tStrategy.refFuturePrice.toString() + "' onChange='updateAll();'/>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 

        if (tStrategy.isVarStrikePrice) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Strike Price</td>"; 
                rowHtml += "    <td><span id='lblStrike'>" + tStrategy.refStrikePrice.toString() + "</span></td>"; 
                rowHtml += "    <td>"; 
                rowHtml += "        <input class='slider' id='txtStrikePrice' type='range' min='4800' max='5200' step='50' value='" + + tStrategy.refStrikePrice.toString() + "' onChange='updateAll();'/>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 
        
        if (tStrategy.isVarGap1) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Gap</td>"; 
                rowHtml += "    <td><span id='lblGap1'>" + tStrategy.refGap1.toString() + "</span></td>"; 
                rowHtml += "    <td>"; 
                rowHtml += "        <input id='txtGap1' type='range' min='50' max='250' step='50' value='" + tStrategy.refGap1.toString() + "' onChange='updateAll();'/>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 
        
        if (tStrategy.isVarGap2) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>2nd Gap</td>"; 
                rowHtml += "    <td><span id='lblGap2'>" + tStrategy.refGap2.toString() + "</span></td>"; 
                rowHtml += "    <td>"; 
                rowHtml += "        <input id='txtGap2' type='range' min='50' max='250' step='50' value='" + tStrategy.refGap2.toString() + "' onChange='updateAll();'/>"; 
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 

        if (tStrategy.isVarRatio) {
            var rowHtml  = "<tr>";
                rowHtml += "    <td>Ratio</td>"; 
                rowHtml += "    <td colspan='2'>"; 
                rowHtml += "        <select id='txtRatio' onchange='updateAll();'>";

//                for (var iRatio=0; iRatio<elearnoptions.arrRatio.length; iRatio=iRatio+1) {
//                    rowHtml += "        <option>" + elearnoptions.arrRatio[iRatio].name + "</option'>";
//                };
                for (var iRatio in elearnoptions.enumRatio) {
                    rowHtml += "        <option value='"+iRatio + "'>" + iRatio + "</option'>";
                };
                rowHtml += "    </td>";
                rowHtml += "</tr>";
          	    tb.append(rowHtml);
        } 

    }

    
    function createTransTable(tStrategy) {
   	    var divTrans = $("#divtrans");

        if (tStrategy.optionLegs > 0) {
            var rowHtml  = "";
            rowHtml  += "<p class='h4'>Option Transactions</p>";
            rowHtml  += "<table id='tableoptiontrans' class='table table-condensed'>";
            rowHtml  += "   <thead>";
            rowHtml  += "       <tr>";
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Sl</th>";
            rowHtml  += "           <th>Opt</th>";
            rowHtml  += "           <th>Trans</th>";
            rowHtml  += "           <th>Strike</th>";
            rowHtml  += "           <th>Qty</th>";
            rowHtml  += "           <th colspan='2'>Premium</th>";
            rowHtml  += "       </tr>";
            rowHtml  += "   </thead>";
            rowHtml  += "   <tbody id='tableoptiontransbody'>";
            rowHtml  += "   </tbody>";
            rowHtml  += "</table>";
            divTrans.append(rowHtml);
        
    	    var tbo = $("#tableoptiontransbody");
        
    	    // Add Placeholder Rows and Premium Slider for each Option Leg in Strategy.
    	    for (var i=0;i<tStrategy.optionLegs;i++) {
    	        // var row = tStrategy.optionTransactions[i];
    	        var rowHtml = "<tr>";
    	        rowHtml += "<td><input type='checkbox' checked='checked' id='chkoption"+ (i+1).toString() + "' onclick='updateAll()'></td>"; // Checkbox
    	        rowHtml += "<td>" + (i+1).toString() + "</td>"; //Serial Number
    	        rowHtml += "<td>&nbsp;</td>"; // Ref Option Type
    	        rowHtml += "<td>&nbsp;</td>"; // Ref Transaction Type
    	        rowHtml += "<td>&nbsp;</td>"; // Strike Price
    	        rowHtml += "<td>&nbsp;</td>"; // Quantity
    	        var premval = tStrategy.refPremium[i];
    	        rowHtml += "<td><span id='lblPremium" + i.toString() +  "'>"  + premval.toString() + "</span></td>"; // Premium
    	        rowHtml += "<td><input id='txtPremium" + i.toString() + "' class='slider' type='range' min='0' max='100' step='5' value='"  + premval.toString() + "' onChange='updateAll();' /></td>"; // Premium Slider
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
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Sl</th>";
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Trans</th>";
            rowHtml  += "           <th>&nbsp;</th>";
            rowHtml  += "           <th>Qty</th>";
            rowHtml  += "           <th colspan='2'>Future Price</th>";
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
    	        rowHtml += "<td><input type='checkbox' checked='checked' id='chkfuture"+ (i+1).toString() + "' onclick='updateAll()'></td>"; // Checkbox
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
    	    tds.eq(2).text(row.optionType.name);
    	    tds.eq(3).text(row.transactionType.name);
    	    tds.eq(4).text(row.strikePrice.toString());
    	    tds.eq(5).text(row.quantity.toString());
        };
        
    	// Update all future Transactions
    	for (var i=0;i<tStrategy.futureTransactions.length;i++) {
    	    var row = tStrategy.futureTransactions[i];
    	    var tds = $('#tablefuturetransbody tr:eq(' + i.toString() + ')').children('td');
    	    //tds.eq(0).text((i+1).toString());
    	    //tds.eq(1).text("&nbsp;");
    	    tds.eq(3).text(row.transactionType.name);
    	    //tds.eq(4).text("&nbsp;");
    	    tds.eq(5).text(row.quantity.toString());
    	    tds.eq(6).text(row.price.toString());
        };
    }
    
    function updateVariables() {
        // ======= Update Strategy with Variable Values
        if (MyGlobals.strategy.isVarFuturePrice) {
            MyGlobals.strategy.refFuturePrice = parseInt($("#txtFuturePrice").val());
            $("#lblFuturePrice").text(MyGlobals.strategy.refFuturePrice);
        }

        if (MyGlobals.strategy.isVarOptionType) {
            MyGlobals.strategy.refOptionType = ((document.getElementById("optCall").checked)?elearnoptions.enumOptionType.CALL:elearnoptions.enumOptionType.PUT);
        }
        
        if (MyGlobals.strategy.isVarTransactionType) {
            MyGlobals.strategy.refTransactionType = ((document.getElementById("optLong").checked)?elearnoptions.enumTransactionType.LONG:elearnoptions.enumTransactionType.SHORT);
        }
        
        if (MyGlobals.strategy.isVarStrikePrice) {
            MyGlobals.strategy.refStrikePrice = parseInt($("#txtStrikePrice").val());
            $("#lblStrike").text(MyGlobals.strategy.refStrikePrice);
        }
        
        if (MyGlobals.strategy.isVarGap1) {
            MyGlobals.strategy.refGap1 = parseInt($("#txtGap1").val());
            $("#lblGap1").text(MyGlobals.strategy.refGap1);
        }
        
        if (MyGlobals.strategy.isVarGap2) {
            MyGlobals.strategy.refGap2 = parseInt($("#txtGap2").val());
            $("#lblGap2").text(MyGlobals.strategy.refGap2);
        }
        
        if (MyGlobals.strategy.isVarRatio) {
            // MyGlobals.strategy.refRatio = elearnoptions.arrRatio[$("#txtRatio").prop("selectedIndex")];
            MyGlobals.strategy.refRatio = elearnoptions.enumRatio[$("#txtRatio").val()];
        }
        
    
        // Update Option wise settings
        for (var i=0;i<MyGlobals.strategy.optionLegs;i = i+ 1) {
            // -- CheckBox
            var isChecked = $('#chkoption' + (i+1).toString()).prop('checked');
            MyGlobals.strategy.optionTransactions[i].active = isChecked;
            // -- Premium
            var premium = parseInt($("#txtPremium"+ i.toString()).val());
            MyGlobals.strategy.refPremium[i] = premium;
            $("#lblPremium"+ i.toString()).text(premium);
            
            
         }
    
    // Update Future wise settings
        for (var i=0;i<MyGlobals.strategy.futureLegs;i = i+ 1) {
            // -- CheckBox
            var isChecked = $('#chkfuture' + (i+1).toString()).prop('checked');
            MyGlobals.strategy.futureTransactions[i].active = isChecked;
         }
    
    }
    

    function updateAll() {
        updateVariables();
        MyGlobals.strategy.updateTransactions();
        updateTable(MyGlobals.strategy);
        updateChart();    
    }
    

    function updateChart() {

        // line1 = MyGlobals.strategy.getChartData(4600,5400,50);
        var dataset = [];
        var linetot = elearnoptions.getChartData(MyGlobals.strategy,4600,5400,50);
        dataset.push({data:linetot, label:"&nbsp;P/L", color:"rgba(40,180,40,0.8)", shadowSize:2});
        
//        for (var i=0; i < MyGlobals.strategy.optionLegs; i++) {
//            var line = elearnoptions.getChartData(MyGlobals.strategy.optionTransactions[i],4600,5400,50);
//            dataset.push({data:line, label:"O" + (i+1).toString()});
//            }
        
		var plot = $.plot("#chartholder", 
		    dataset, {
			series: {
				lines: {
					show: true,
					fill:0.00
				},
				threshold: { below: 0, color: "rgba(240,60, 60,0.80)" },
				points: {
					show: true
				}
			},
			grid: {
			    markings: [ { yaxis: { from: 0, to: 0 }, color: "rgba(200,200,200,0.50)" } ],
				hoverable: true,
				clickable: false
			},
			xaxis: {
			        tickColor: "rgba(220,220,220,0.30)"
			        },
			yaxis: {
				tickColor: "rgba(220,220,220,0.30)",
				min: -250,
				max: 250
			}
		});

		$("<div id='tooltip'></div>").css({
			position: "absolute",
			display: "none",
			border: "1px solid #aab",
			padding: "4px",
			"background-color": "#ffc",
			opacity: 0.90
		}).appendTo("body");

		$("#chartholder").bind("plothover", function (event, pos, item) {
			if (item) {
				var x = item.datapoint[0].toFixed(0),
					y = item.datapoint[1].toFixed(0);
                if ((item.pageX + 180) > $(document).width()) {var posx = item.pageX - 120} else {var posx = item.pageX + 12};
                
				$("#tooltip").html("Settlement = " + x + "<br/>P/L = " + y)
					.css({top: item.pageY+12, left: posx})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
		});

		$("#chartholder").bind("plotclick", function (event, pos, item) {
			if (item) {
				$("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
				plot.highlight(item.series, item.datapoint);
			}
		});

		// Add the Flot version string to the footer

		$("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
    }
    
    function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
