elearnoptions = (function() {
 
  //-------------------- Variables in the namespace
  var elearnoptions = {
    creator: "KPTECH",
    enumOptionType: { CALL: {value:1, name:"Call"},
                      PUT: {value:-1, name:"Put"}
                    },
    
    enumTransactionType: { LONG: {value: 1, name:"Long"},
                           SHORT: {value: -1, name:"Short"}
                         },
    
    enumRatio:     { "1:2": {numerator: 1, denominator: 2},
                     "1:3": {numerator: 1, denominator: 3},
                     "1:4": {numerator: 1, denominator: 4},
                     "1:5": {numerator: 1, denominator: 5},
                     "1:6": {numerator: 1, denominator: 6},
                     "1:7": {numerator: 1, denominator: 7},
                     "2:3": {numerator: 2, denominator: 3},
                     "2:5": {numerator: 2, denominator: 5},
                     "2:7": {numerator: 2, denominator: 7},
                     "3:4": {numerator: 3, denominator: 4},
                     "3:5": {numerator: 3, denominator: 5},
                     "3:7": {numerator: 3, denominator: 7},
                     "4:5": {numerator: 4, denominator: 5},
                     "4:7": {numerator: 4, denominator: 7},
                     "5:7": {numerator: 5, denominator: 7},
                     "6:7": {numerator: 6, denominator: 7}
                   },
                     
    arrRatio:      [{ name:"1:2", numerator: 1, denominator: 2},
                    { name:"1:3", numerator: 1, denominator: 3},
                    { name:"1:4", numerator: 1, denominator: 4},
                    { name:"1:5", numerator: 1, denominator: 5},
                    { name:"1:6", numerator: 1, denominator: 6},
                    { name:"1:7", numerator: 1, denominator: 7},
                    { name:"2:3", numerator: 2, denominator: 3},
                    { name:"2:5", numerator: 2, denominator: 5},
                    { name:"2:7", numerator: 2, denominator: 7},
                    { name:"3:4", numerator: 3, denominator: 4},
                    { name:"3:5", numerator: 3, denominator: 5},
                    { name:"3:7", numerator: 3, denominator: 7},
                    { name:"4:5", numerator: 4, denominator: 5},
                    { name:"4:7", numerator: 4, denominator: 7},
                    { name:"5:7", numerator: 5, denominator: 7},
                    { name:"6:7", numerator: 6, denominator: 7}
                   ]
  };


    elearnoptions.enumOptionType.CALL.reverse = elearnoptions.enumOptionType.PUT;
    elearnoptions.enumOptionType.PUT.reverse = elearnoptions.enumOptionType.CALL;

    elearnoptions.enumTransactionType.LONG.reverse = elearnoptions.enumTransactionType.SHORT;
    elearnoptions.enumTransactionType.SHORT.reverse = elearnoptions.enumTransactionType.LONG;
  
    // Public Method getChartData > Returns ChartData from any object which supports getProfitLoss method.
    elearnoptions.getChartData = function(tObject, xstart, xend, xinterval) {
        var chartData = [];
        for (var i=xstart; i<=xend; i += xinterval) {
            chartData.push([i,tObject.getProfitLoss(i)]);
        }
        return chartData;
    };


    elearnoptions.dOne = function(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility) {
        var nPart1 = 1/(tVolatility * Math.sqrt(tTimeToExpiry));
        var nPart2 = Math.log(tUnderlyingPrice/ tStrikePrice);
        var nPart3 = (tInterestRate + 0.5*Math.pow(tVolatility,2)) * tTimeToExpiry;
        return (nPart1*(nPart2 +nPart3));
    }
    
    elearnoptions.dTwo = function(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility) {
        var d1 = elearnoptions.dOne(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility);
        return (d1-(tVolatility * Math.sqrt(tTimeToExpiry)));
    }
    
    elearnoptions.NormSDist = function(x){
        // Approximation method for Standard Normal Distribution Cumulative Density Function. x=any random value. Returns Cumu Prob for <=x;
        var a1, a2, a3, a4 ,a5, k ;
        a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;
        if ( x < 0.0) {
            return 1-elearnoptions.NormSDist(-x);
        }
        else
        {
            k = 1.0 / (1.0 + 0.2316419 * x);
        }
        return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI) * k
                * (a1 + k * (a2 + k * (a3 + k * (a4 + k * a5)))) ;

    }
    
    elearnoptions.callDelta = function(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility) {    
        return elearnoptions.NormSDist(elearnoptions.dOne(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility));
    }        
    
    elearnoptions.blackScholesPremium = function(tOptionType,tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility) {    
        var prem;
        var d1 = elearnoptions.dOne(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility);
        var d2 = elearnoptions.dTwo(tUnderlyingPrice, tStrikePrice, tTimeToExpiry, tInterestRate, tVolatility);
        if (tOptionType === elearnoptions.enumOptionType.CALL) {
            var nPart1 = tUnderlyingPrice * elearnoptions.NormSDist(d1);
            var nPart2 = tStrikePrice * Math.exp(-tInterestRate * tTimeToExpiry) * elearnoptions.NormSDist(d2);
            prem =  (nPart1 - nPart2);
        }
        if (tOptionType === elearnoptions.enumOptionType.PUT) {
            var nPart1 = tUnderlyingPrice * elearnoptions.NormSDist(-d1);
            var nPart2 = tStrikePrice * Math.exp(-tInterestRate * tTimeToExpiry) * elearnoptions.NormSDist(-d2);
            prem=  (-nPart1 + nPart2);
        }
        return prem;
    }
//  // "Public" methods for the namespace
//  elearnoptions.getReverseOptionType = function(tOptionType) {
//    return ((tOptionType==elearnoptions.enumOptionType.CALL)?elearnoptions.enumOptionType.PUT:elearnoptions.enumOptionType.CALL);
//  };
//  
//  elearnoptions.getReverseTransactionType = function(tTransactionType) {
//    return ((tTransactionType==elearnoptions.enumTransactionType.LONG)?elearnoptions.enumTransactionType.SHORT:elearnoptions.enumTransactionType.LONG);
//  };
  
// 
//  // "Private" methods in the namespace
//  function twice(x) {
//    return x + " " + x;
//  }

  // A class in the namespace
  elearnoptions.OptionTransaction = (function() {
    // Contstructor
    var optiontransaction = function() {
      this.optionType = elearnoptions.enumOptionType.CALL;
      this.transactionType = elearnoptions.enumTransactionType.LONG;
      this.premium = 100;
      this.strikePrice = 5000; 
      this.quantity=1;
      this.active=true;
    };
 
  
    // "Public" methods - add to the prototype
     optiontransaction.prototype.getProfitLoss = function(settlementPrice) {
     if (this.active) {
         var intrinsic =  Math.max(0,(settlementPrice-this.strikePrice) * this.optionType.value);
         var profitloss	= (intrinsic - this.premium) * this.transactionType.value  * this.quantity;
     }
     else {
         var profitloss	= 0;}
     return profitloss;
     
    };

// 
//    // "Private" methods - functions starting with "_" are private only by
//    // convention. 
//    optiontransaction.prototype._nineTimesPremium = function() {
//      return thrice(thrice(this.premium));
//    };
// 
//    // Internal functions - these are captured in the closure, note that they
//    // are not duplicated when you do `new CoolClass()`. They cannot access
//    // `this`.
//    function thrice(x) {
//      return x + x +  x;
//    }
 
    return optiontransaction;
  })();
 
 
  //-------------------------------------- FutureTransaction Class
  elearnoptions.FutureTransaction = (function() {
    // Constructor
    var futuretransaction = function() {
      this.transactionType = elearnoptions.enumTransactionType.LONG;
      this.price = 5000;
      this.quantity=1;
      this.active = true;
    };
 
  
    // "Public" methods - add to the prototype
    futuretransaction.prototype.getProfitLoss = function(settlementPrice) {
         if (this.active) {
     	    var profitloss	= ((settlementPrice - this.price)*this.quantity) * this.transactionType.value;
     	 }
     	 else {
     	    var profitloss = 0;
     	 }
         return profitloss;
    };

    return futuretransaction;
  })();
 
 //------------------------------------------------------------------------ Strategy
      // A class in the namespace
      elearnoptions.Strategy = (function() {
     
      // Contstructor
      var strategy = function() {
      
      this.id = "";
      this.name = "";
      this.description = "";
      this.optionLegs = 0;
      this.futureLegs = 0;
      this.optionTransactions = [];
      this.futureTransactions = [];
      
      // Applicability of Variables
      this.isVarFuturePrice = false;
      this.isVarOptionType = false;
      this.isVarTransactionType = false;
      this.isVarStrikePrice = false;
      this.isVarGap1 = false;
      this.isVarGap2 = false;
      this.isVarRatio = false;
      
      // Variables and their default values
      this.refFuturePrice = 4900;
      this.refOptionType = elearnoptions.enumOptionType.CALL;
      this.refTransactionType = elearnoptions.enumTransactionType.LONG;
      this.refStrikePrice = 5000;
      this.refGap1 = 100;
      this.refGap2 = 100;
      //this.refRatio = elearnoptions.arrRatio[0];
      this.refRatio = elearnoptions.enumRatio["1:2"];
      
      this.refPremium = [70,40,30,10];
    };
    
    // initiates properties, variables and defaults
    strategy.prototype.initStrategy = function(tcStrategyId) {
        this.id = tcStrategyId;
        switch (this.id) {
            case "Long" :
                // Define Legs 
                this.name = "Long";
                this.description = "<p><span class='strategyname'>Long</span> - Going long in an option means to buy a Call or Put option. The maximum loss in a Long option trasaction is limited to the amount of premium paid. </p>";
                this.description += "<p>A Long Call option is favourable when the price of the underlying is expected to rise. Similarly, a Long Put option is favourable when the price of the underlying is expected to fall.</p>";
                this.description += "<p>The quicker the expected rise or fall happens, the more is the earning potential.</p>";
                

                this.optionLegs = 1;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarStrikePrice = true;
                
                break;
            case "Short" :
                // Define Legs 
                this.name = "Short";
                this.description = "<p><span class='strategyname'>Short</span> - Going short in an option means to sell a Call or Put option. The maximum profit in a Short option trasaction is limited to the amount of premium received.</p>";
                this.description += "<p>A Short Call option is favourable when there is a high probability of fall in the price of the underlying. Similarly, a Short Put option is favourable when there is a high probability of rise in the price of the underlying.</p>";
                this.description += "<p>However in case the movement happens otherwise, the loss from a short option transaction may be unlimited<span title='Limited for Put option as price cannot go below 0'>*</span>.</p>";

                this.optionLegs = 1;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarStrikePrice = true;
                
                break;
            case "BullSpread" :
                // Define Legs 
                this.name = "Bull Spread";
                this.description = "<p><span class='strategyname'>Bull Spread</span> is a strategy achieved by combining two options of the same type, by buying an option at one strike price and selling another option at a higher strike price. This strategy may be achieved using either CALL or PUT options.</p>";
                this.description += "<p>This is a limited profit / limited loss strategy, which works well in case the underlying is expected to rise moderately. This type of strategy helps to reduce the premium cost of a naked option.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                this.refStrikePrice=4950;
                this.refGap1=100;

                break;
            case "BearSpread" :
                // Define Legs 
                this.name = "Bear Spread";
                this.description = "<p><span class='strategyname'>Bear Spread</span> is a strategy achieved by combining two options of the same type, by buying an option at one strike price and selling another option at a lower strike price. This strategy may be achieved using either CALL or PUT options.</p>";
                this.description += "<p>This is a limited profit / limited loss strategy, which works well in case the underlying is expected to fall moderately. This type of strategy helps to reduce the premium cost of a naked option.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                this.refStrikePrice=4950;
                this.refGap1=100;

                break;
            case "Stradle" :
                // Define Legs 
                this.name = "Stradle";
                this.description = "<p><span class='strategyname'>Stradle</span> is a strategy achieved by combining a CALL and a PUT option at the same strike price. The strategy may be achieved by either going LONG in both the transactions or going SHORT in both the transactions.</p>";
                this.description += "<p>A Long Stradle is favourable when the price is expected to move in either direction and it may fetch unlimited<span title='For PUT transaction, price cannot go below ZERO'>*<span> profits, whereas the  maximum loss is limited. A Short Stradle fetches profit where the expected movement in price is small.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                
                break;
            case "Strangle" :
                // Define Legs 
                this.name = "Strangle";
                this.description = "<p><span class='strategyname'>Strangle</span> is a strategy achieved by combining a PUT option transaction with a similar CALL option transaction at a higher strike price.</p>";
                this.description += "<p>A Long Strangle is favourable when the price is expected to move substantially in either direction. A short strangle is expected to fetch profits if the prices do not move too much in either direction.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;

                this.refStrikePrice=4950;
                this.refGap1=100;
                
                break;
            case "Gut" :
                // Define Legs 
                this.name = "Gut";
                this.description = "<p><span class='strategyname'>Gut</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a gut, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                
                this.refStrikePrice=4950;
                this.refGap1=100;
                this.refPremium[0]=70;
                this.refPremium[1]=70;


                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                break;
            case "Butterfly" :
                // Define Legs 
                this.name = "Butterfly";
                this.description = "<p><span class='strategyname'>Butterfly Strategy</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a butterfly, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 3;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                break;
            case "LongButterfly" :
                // Define Legs 
                this.name = "Long Butterfly";
                this.description = "<p><span class='strategyname'>Long Butterfly Strategy</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a butterfly, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 3;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;


                break;
            case "Condor" :
                // Define Legs 
                this.name = "Condor";
                this.description = "<p><span class='strategyname'>Condor</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a butterfly, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 4;
                this.futureLegs = 0;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                this.isVarGap2 = true;
                
                //Default values of variables
                this.refStrikePrice = 4800;
                this.refGap1 = 150;
                this.refGap2 = 100;
                this.refPremium[0]=50;
                this.refPremium[1]=10;
                this.refPremium[2]=10;
                this.refPremium[3]=50;
                
                
                break;
            case "IronButterfly" :
                // Define Legs 
                this.name = "Iron Butterfly";
                this.description = "<p><span class='strategyname'>Iron Butterfly</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a iron butterfly, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 4;
                this.futureLegs = 0;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                //Default values of variables
                this.refStrikePrice = 4900;
                this.refGap1 = 100;
                
                this.refPremium[0]=20;
                this.refPremium[1]=50;
                this.refPremium[2]=50;
                this.refPremium[3]=20;
                
                break;
            case "IronCondor" :
                // Define Legs 
                this.name = "Iron Condor";
                this.description = "<p><span class='strategyname'>Iron Condor</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a iron condor, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 4;
                this.futureLegs = 0;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                this.isVarGap2 = true;                

                //Default values of variables
                this.refStrikePrice = 4800;
                this.refGap1 = 100;
                this.refGap2 = 200;
                
                this.refPremium[0]=70;
                this.refPremium[1]=60;
                this.refPremium[2]=50;
                this.refPremium[3]=10;
                
                
                break;
            case "CoveredCall" :
                // Define Legs 
                this.name = "Covered Call";
                this.description = "<p><span class='strategyname'>Covered Call</span> / Short Synthetic Put is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a covered call, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 1;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;
                
                break;
            case "ProtectivePut" :
                // Define Legs 
                this.name = "Protective Put";
                this.description = "<p><span class='strategyname'>Protective Put</span> / Long Synthetic Call is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a protective put, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 1;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;

                this.refFuturePrice = 5000;
                this.refStrikePrice = 4900;
                
                
                break;
            case "ShortSyntheticCall" :
                // Define Legs 
                this.name = "Short Synthetic Call";
                this.description = "<p><span class='strategyname'>Short Synthetic Call</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a short synthetic call, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 1;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;

                this.refFuturePrice = 5000;
                this.refStrikePrice = 4900;
                
                break;
            case "LongSyntheticPut" :
                // Define Legs 
                this.name = "Long Synthetic Put";
                this.description = "<p><span class='strategyname'>Long Synthetic Put</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a long synthetic put, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 1;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;

                this.refFuturePrice = 5000;
                this.refStrikePrice = 4900;
                
                break;
            case "Conversion" :
                // Define Legs 
                this.name = "Conversion Arbitrage";
                this.description = "<p><span class='strategyname'>Conversion</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a Conversion, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;

                this.refFuturePrice = 5000;
                this.refStrikePrice = 4900;
                
                break;
            case "Reversal" :
                // Define Legs 
                this.name = "Reversal Arbitrage";
                this.description = "<p><span class='strategyname'>Reversal</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a Reversal, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                this.futureLegs = 1;
                
                // Define Applicability of Variables
                this.isVarFuturePrice = true;
                this.isVarStrikePrice = true;

                this.refFuturePrice = 5000;
                this.refStrikePrice = 4900;
                
                break;
            case "BoxSpread" :
                // Define Legs 
                this.name = "Box Spread";
                this.description = "<p><span class='strategyname'>Box Spread</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a box spread, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 4;
                this.futureLegs = 0;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                
                //Default values of variables
                this.refStrikePrice = 4950;
                this.refGap1 = 100;
                this.refPremium[0]=50;
                this.refPremium[1]=10;
                this.refPremium[2]=10;
                this.refPremium[3]=50;
                
                break;
            case "Strip" :
                // Define Legs 
                this.name = "Strip";
                this.description = "<p><span class='strategyname'>Strip</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a strip, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                
                break;
            case "Strap" :
                // Define Legs 
                this.name = "Strap";
                this.description = "<p><span class='strategyname'>Strap</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a strap, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                
                break;
            case "RatioSpread" :
                // Define Legs 
                this.name = "Ratio Spread";
                this.description = "<p><span class='strategyname'>Ratio Spread</span> is a limited risk, non-directional options strategy that is designed to have a large probabilty of earning a limited profit when the future volatility of the underlying asset is expected to be lower than the implied volatility.</p>";
                this.description += "<p>For a ratio spread, the trader sells two option contracts at the middle strike price and buys one option contract at a lower strike price and one option contract at a higher strike price. Both puts and calls can be used for a butterfly spread.</p>";

                this.optionLegs = 2;
                
                // Define Applicability of Variables
                this.isVarOptionType = true;
                this.isVarTransactionType = true;
                this.isVarStrikePrice = true;
                this.isVarGap1 = true;
                this.isVarRatio = true;
                
                break;
            default :
                break;
        }
        
        // add required blank OPTION transactions
        for (var iOptionTransaction=0; iOptionTransaction<this.optionLegs; iOptionTransaction +=1) {
            oOptionTransaction = new elearnoptions.OptionTransaction();
            this.optionTransactions.push(oOptionTransaction);
        }
        
        // add required blank Future transactions
        for (var iFutureTransaction=0; iFutureTransaction<this.futureLegs; iFutureTransaction +=1) {
            oFutureTransaction = new elearnoptions.FutureTransaction();
            this.futureTransactions.push(oFutureTransaction);
        }
    };
 
    // updates strategy transactions based on latest variable values
    strategy.prototype.updateTransactions = function() {
        var ots = this.optionTransactions;
        switch (this.id) {
            case "Long" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
                break;
            case "Short" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
                break;
            case "BullSpread" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "BearSpread" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "Stradle" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = this.refTransactionType;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "Strangle" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[1].transactionType = this.refTransactionType;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "Gut" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = this.refTransactionType;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
   
            case "Butterfly" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice - this.refGap1;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 2;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = this.refOptionType;
   	            this.optionTransactions[2].transactionType = this.refTransactionType;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice +  this.refGap1;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];

                break;
            case "LongButterfly" :
                // First Leg
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice - this.refGap1;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
                // Second Leg
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 2;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = this.refOptionType;
   	            this.optionTransactions[2].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice +  this.refGap1;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];
                        
                break;
            case "Condor" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = this.refOptionType;
   	            this.optionTransactions[2].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice +  this.refGap1 + this.refGap2;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];

   	            this.optionTransactions[3].optionType = this.refOptionType;
   	            this.optionTransactions[3].transactionType = this.refTransactionType;
   	            this.optionTransactions[3].strikePrice = this.refStrikePrice +  this.refGap1 + this.refGap2 + this.refGap1;
                this.optionTransactions[3].quantity = 1;
                this.optionTransactions[3].premium = this.refPremium[3];

                break;
            case "IronButterfly" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[2].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice +  this.refGap1;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];

   	            this.optionTransactions[3].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[3].transactionType = this.refTransactionType;
   	            this.optionTransactions[3].strikePrice = this.refStrikePrice +  this.refGap1 + this.refGap1;
                this.optionTransactions[3].quantity = 1;
                this.optionTransactions[3].premium = this.refPremium[3];

                break;
            case "IronCondor" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[2].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice +  this.refGap1 + this.refGap2;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];

   	            this.optionTransactions[3].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[3].transactionType = this.refTransactionType;
   	            this.optionTransactions[3].strikePrice = this.refStrikePrice +  this.refGap1 + this.refGap2 + this.refGap1 ;
                this.optionTransactions[3].quantity = 1;
                this.optionTransactions[3].premium = this.refPremium[3];

                break;
            case "CoveredCall" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "ProtectivePut" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "ShortSyntheticCall" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "LongSyntheticPut" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "Conversion" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[1].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "Reversal" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = elearnoptions.enumTransactionType.LONG;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.futureTransactions[0].transactionType = elearnoptions.enumTransactionType.SHORT;
   	            this.futureTransactions[0].price = this.refFuturePrice;
                this.futureTransactions[0].quantity = 1;

                break;
            case "BoxSpread" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

   	            this.optionTransactions[2].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[2].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[2].strikePrice = this.refStrikePrice;
                this.optionTransactions[2].quantity = 1;
                this.optionTransactions[2].premium = this.refPremium[2];

   	            this.optionTransactions[3].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[3].transactionType = this.refTransactionType;
   	            this.optionTransactions[3].strikePrice = this.refStrikePrice +  this.refGap1  ;
                this.optionTransactions[3].quantity = 1;
                this.optionTransactions[3].premium = this.refPremium[3];

                break;
            case "Strip" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 1;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = this.refTransactionType;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 2;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "Strap" :
   	            this.optionTransactions[0].optionType = elearnoptions.enumOptionType.CALL;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = 2;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = elearnoptions.enumOptionType.PUT;
   	            this.optionTransactions[1].transactionType = this.refTransactionType;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice;
                this.optionTransactions[1].quantity = 1;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            case "RatioSpread" :
   	            this.optionTransactions[0].optionType = this.refOptionType;
   	            this.optionTransactions[0].transactionType = this.refTransactionType;
   	            this.optionTransactions[0].strikePrice = this.refStrikePrice;
                this.optionTransactions[0].quantity = this.refRatio.numerator;
                this.optionTransactions[0].premium = this.refPremium[0];
                
   	            this.optionTransactions[1].optionType = this.refOptionType;
   	            this.optionTransactions[1].transactionType = this.refTransactionType.reverse;
   	            this.optionTransactions[1].strikePrice = this.refStrikePrice + this.refGap1;
                this.optionTransactions[1].quantity = this.refRatio.denominator;
                this.optionTransactions[1].premium = this.refPremium[1];

                break;
            default :
                break;
        }

    };

    
    // "Public" methods - add to the prototype
    strategy.prototype.getProfitLoss = function(settlementPrice) {
      var totprofit=0;
      for (i=0;i<this.optionTransactions.length;i++) {
        totprofit += this.optionTransactions[i].getProfitLoss(settlementPrice);
      };
      for (j=0;j<this.futureTransactions.length;j++) {
        totprofit += this.futureTransactions[j].getProfitLoss(settlementPrice);
      };
      return totprofit;
    };

    strategy.prototype.getChartData = function(xstart, xend, xinterval) {
        var chartData = [];
        for (var i=xstart; i<=xend; i += xinterval) {
            chartData.push([i,this.getProfitLoss(i)]);
        }
        return chartData;
    };



    return strategy;
  })();
 
  //-------------------------------------- Challenge Class
  elearnoptions.Challenge = (function() {
        // Constructor
        var challenge = function() {
            this.transactionTypeDist = [[elearnoptions.enumTransactionType.LONG, 0.50],
                                    [elearnoptions.enumTransactionType.SHORT,0.50]];
                                    
            this.optionTypeDist = [[elearnoptions.enumOptionType.CALL, 0.50],
                                   [elearnoptions.enumOptionType.PUT , 0.50]];

            this.futurePriceDist = [[  100,  250,  5  , 0.10],
                                    [  250,  500, 10  , 0.10],
                                    [  500, 1500, 20  , 0.10],
                                    [ 1500, 4000, 50  , 0.15],
                                    [ 4000, 7500, 50  , 0.40],
                                    [ 7500,10000, 50  , 0.10],
                                    [10000,15000,100  , 0.05]];

            this.intervalSlabs   = [[  100,  250,  5  ],
                                    [  250,  500, 10  ],
                                    [  500, 1500, 20  ],
                                    [ 1500, 4000, 50  ],
                                    [ 4000, 7500, 50  ],
                                    [ 7500,10000, 50  ],
                                    [10000,100000,100  ]];
                                    
            this.distanceDist    = [[0,0.10],
                                    [1,0.20],
                                    [2,0.20],
                                    [3,0.10],
                                    [4,0.10],
                                    [5,0.10],
                                    [6,0.10],
                                    [7,0.05],
                                    [8,0.05]];

            this.gapDist          = [[1,0.20],
                                     [2,0.50],
                                     [3,0.10],
                                     [4,0.20]];
                                     
            this.strategyDist = [];
            
            this.strategyDist[0] =  [["Long",0.5],
                                     ["Short",0.5]];
                                     
            this.strategyDist[1] =  [["Long",0.2],
                                    ["Short",0.2],
                                    ["BullSpread",0.3],
                                    ["BearSpread",0.3]];

            this.strategyDist[2] =  [["Long",0.10],
                                    ["Short",0.10],
                                    ["BullSpread",0.15],
                                    ["BearSpread",0.15],
                                    ["Gut",0.10],
                                    ["Stradle",0.20],
                                    ["Strangle",0.20]];

            this.strategyDist[3] = [["Long",0.05],
                                    ["Short",0.05],
                                    ["BullSpread",0.05],
                                    ["BearSpread",0.05],
                                    ["Buttefly",0.20],
                                    ["Stradle",0.10],
                                    ["Strangle",0.10],
                                    ["Gut",0.10],
                                    ["Condor",0.10],
                                    ["IronButterfly",0.10],
                                    ["IronCondor",0.10]];
                                     

            this.strategyDist[4] = [["Long",0.02],
                                    ["Short",0.02],
                                    ["BullSpread",0.04],
                                    ["BearSpread",0.04],
                                    ["Butterfly",0.06],
                                    ["Stradle",0.08],
                                    ["Strangle",0.08],
                                    ["Gut",0.02],
                                    ["Condor",0.04],
                                    ["IronButterfly",0.04],
                                    ["IronCondor",0.06],
                                    ["CoveredCall",0.06],
                                    ["ProtectivePut",0.06],
                                    ["ShortSyntheticCall",0.04],
                                    ["LongSyntheticPut",0.04],
                                    ["BoxSpread",0.03],
                                    ["Conversion",0.03],
                                    ["Reversal",0.03],
                                    ["Strip",0.06],
                                    ["Strap",0.06],
                                    ["RatioSpread",0.09]];

                this.ratioDist =   [["1:2",0.2],
                                    ["1:3",0.1],
                                    ["1:4",0.05],
                                    ["1:5",0.05],
                                    ["1:6",0.05],
                                    ["1:7",0.05],
                                    ["2:3",0.05],
                                    ["2:5",0.05],
                                    ["2:7",0.05],
                                    ["3:4",0.05],
                                    ["3:5",0.05],
                                    ["3:7",0.05],
                                    ["4:5",0.05],
                                    ["4:7",0.05],
                                    ["5:7",0.05],
                                    ["6:7",0.05]];
                                    
                this.volatilityDist =  [[   0.20,  0.30,  0.001, 0.15],
                                        [  0.30,  0.50,  0.001 , 0.70],
                                        [  0.50,  0.60, 0.001  , 0.15]];

                this.timeToExpiryDist = [[20,60,1,1.00]];

        };
    
        // "Public" methods
        challenge.prototype.getRandomDiscrete = function(tArray) {
             // tArray format [[object,probability], [object, probability]...]
            var rand = Math.random();
            var item;
            var cumProbability = 0;
            for (var i=0; i < tArray.length ; i++) {
                cumProbability += tArray[i][1];        
                if (rand <= cumProbability) {
                    item = tArray[i][0];
                    break;
                } 
            }
            return item;
        }
        
        challenge.prototype.getRandomContinuous = function(tArray) {
             // tArray format [from, to, rounding,probability],[from, to, rounding,probability]...]
             // The system will return a number at random from between from(inclusive) and to(exclusive) 
            var rand = Math.random();
            var rounded;
            var cumProbability = 0;
            for (var i=0; i < tArray.length ; i++) {
                cumProbability += tArray[i][3];
                if (rand <= cumProbability) {
                    var from     = tArray[i][0];
                    var to       = tArray[i][1];
                    var rounding = tArray[i][2];
                    var prob     = tArray[i][3];
                    var unrounded    = to - ((cumProbability - rand)*((to - from)/prob));
                    // round down to ensure uniformity and limit the higher one. 
                    var rounded = Math.floor(unrounded/rounding)*rounding;
                    break;
                }
            }
            return rounded;
        }
        
        // Public Method getRandomStrategy for the given level
        challenge.prototype.getRandomStrategy = function(tLevel) {
            return this.getRandomDiscrete(this.strategyDist[tLevel]);
        }

        // Public Method getRandomTransactionType
        challenge.prototype.getRandomFuturePrice = function() {
            return this.getRandomContinuous(this.futurePriceDist);
        }
        

        // Public Method getRandomTransactionType
        challenge.prototype.getRandomTransactionType = function() {
            return this.getRandomDiscrete(this.transactionTypeDist);
        }

        // Public Method getRandomOptionType
        challenge.prototype.getRandomOptionType = function() {
            return this.getRandomDiscrete(this.optionTypeDist);
        }

        challenge.prototype.getRandomSign = function() {
            return this.getRandomDiscrete([[1,0.5],[-1,0.5]]);
        }
        
        challenge.prototype.getRandomVolatility = function() {
            return this.getRandomContinuous(this.volatilityDist);
        }
        
        challenge.prototype.getRandomTimeToExpiry = function() {
            return this.getRandomContinuous(this.timeToExpiryDist);
        }
        
        // Public Method getRandomStrikePrice from Interval+RandomDistabce
        challenge.prototype.getRandomStrikePrice = function(tFuturePrice,tInterval) {
            var distance = this.getRandomDiscrete(this.distanceDist);
            var strike = tFuturePrice + ((tInterval*distance)*this.getRandomSign());
            return strike;
        }
        
        
        // Public Method getRandomGap // always positive
        challenge.prototype.getRandomGap = function(tInterval) {
            return (this.getRandomDiscrete(this.gapDist)*tInterval);
        }
        
        // "Public" methods
        challenge.prototype.getInterval = function(tFuturePrice) {
             // tArray format [[object,probability], [object, probability]...]
            var interval;
            var cumProbability = 0;
            for (var i=0; i < this.intervalSlabs.length ; i++) {
                if ((tFuturePrice >= this.intervalSlabs[i][0] ) && (tFuturePrice < this.intervalSlabs[i][1] )) {
                    interval = this.intervalSlabs[i][2];
                    break;
                } 
            }
            return interval;
        }
        
        challenge.prototype.getRandomRatio = function() {
            return elearnoptions.enumRatio[this.getRandomDiscrete(this.ratioDist)];
        }

        // Public Method getRandomStrikePrice from Interval+RandomDistabce
        challenge.prototype.getRandomScenario = function(tFuturePrice,tInterval) {
            //Any random number between FuturePrice +/- 10 times the interval rounded to 1 rupee
            var scenarioDist = [[tFuturePrice-(10*tInterval),tFuturePrice+(10*tInterval),1,1]];
            var scenario = this.getRandomContinuous(scenarioDist);
            return scenario;
        }
        
    return challenge;
  })();
 
  //-------------------------------------- RandomQuestion Class
  elearnoptions.RandomQuestion = (function() {
        // Constructor
        var randomquestion = function(tStrategyId,tLevel) {
            this.strategy = new elearnoptions.Strategy();

            // if strategy name is "" or null, get a random strategy. 
            var oChallenge = new elearnoptions.Challenge();
            tStrategyId = tStrategyId || oChallenge.getRandomStrategy(tLevel);
                 
            //var id = oChallenge.getRandomStrategy(tLevel);
            this.strategy.initStrategy(tStrategyId);
            // set random values for strategy parameters
            // Future Price 
            this.strategy.refFuturePrice = oChallenge.getRandomFuturePrice();
            var interval = oChallenge.getInterval(this.strategy.refFuturePrice);
            // Option Type
            if (this.strategy.isVarOptionType) {
                this.strategy.refOptionType = oChallenge.getRandomOptionType();
            }
            // Transaction Type
            if (this.strategy.isVarTransactionType) {
                this.strategy.refTransactionType = oChallenge.getRandomTransactionType();
            }
            // Strike Price
            if (this.strategy.isVarStrikePrice) {
                this.strategy.refStrikePrice = oChallenge.getRandomStrikePrice(this.strategy.refFuturePrice, interval);
            }
            // Gap1
            if (this.strategy.isVarGap1) {
                this.strategy.refGap1 = oChallenge.getRandomGap(interval);
            }
            // Gap2
            if (this.strategy.isVarGap2) {
                this.strategy.refGap2 = oChallenge.getRandomGap(interval);
            }
            // Ratio
            if (this.strategy.isVarRatio) {
                this.strategy.refRatio = oChallenge.getRandomRatio();
            }

            // Premium
            var interestRate = 0;
            var volatility = oChallenge.getRandomVolatility();
            var timeToExpiry = oChallenge.getRandomTimeToExpiry()/365; 
            for (var i=0;i<this.strategy.optionLegs;i++) {
//              reset initial premiums with NIL.
                this.strategy.refPremium[i] = 0;
            }
            
            //Update transactions without premium
            this.strategy.updateTransactions();

            //Update BlackScholesPremium
            for (var i=0;i<this.strategy.optionLegs;i++) {
                o = this.strategy.optionTransactions[i];
                var calcPrem = elearnoptions.blackScholesPremium(o.optionType,this.strategy.refFuturePrice, o.strikePrice, timeToExpiry, interestRate, volatility);
                o.premium = Math.max(Math.round(calcPrem),1); // Premium cannot be nil hence min 1.
            }
            
            // Create Scenarios
            this.scenarioCount = 3;
            this.scenarios = [];
            for (var i=0; i<this.scenarioCount; i++) {
                this.scenarios.push(oChallenge.getRandomScenario(this.strategy.refFuturePrice,interval));
            }
        }
        return randomquestion;
  })();       

        
 
  return elearnoptions;
})();
