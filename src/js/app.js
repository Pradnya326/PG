App = {
  loading: false,
  contracts: {},  
  load: async () => {
    //window.alert("load");
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
   // var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);
   
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const Sample = await $.getJSON('Employee.json')
    App.contracts.Sample = TruffleContract(Sample)
    App.contracts.Sample.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.employee = await App.contracts.Sample.deployed();
  },

  ShowEmpDetails : async() => {
    var a = $("#empoptions").val();
   
    var e = await App.employee.empInfo(parseInt(a));
    

    $("#displayoname").val(e[0]);
    $("#displayoname").val(e[0]);
    $("#displayoemail").val(e[1]);
    $("#displayophone").val(e[2]);
    $("#displayosalary").val(e[3].toString());
  },

  updateSal : async() =>{
    var a = $("#displayosalary").val();
    var o = $("#empoptions").val();
        
    await App.employee.updateSalary(parseInt(o), parseInt(a),{from:App.account});  
    var e = await App.employee.empInfo(parseInt(o));
    
    $("#displayosalary").prop('disabled', true);
    },

  editSal : async() => {
    
    $("#displayosalary").prop('disabled', false);
  },

  register : async() => {
    var n = $("#uname").val();
    var e = $("#uemail").val();
    var p = $("#uphone").val();
    var s = $("#usalary").val();
    var a = $("#options").val();
    
    window.alert(App.account);
    await App.employee.addEmployee(n,e,p,s,a,{from:App.account});
    App.render();
  },

    
  render: async () => {

    var role = await App.employee.roles(App.account);    
    var a = await App.employee.admin();
    
    
    if(a.toString().toUpperCase() == App.account.toString().toUpperCase()){
      
         

      var count = await App.employee.total();
      var c = parseInt(count);
      $("#admindata").empty();
      
      
      for(var i= 1; i<= c; i++){
        
        var d = await App.employee.empInfo(parseInt(i));
        
        var str = "<tr><td>"+d[0]+"</td><td>"+d[1]+"</td><td>"+d[2]+"</td><td>"+d[3].toString()+"</td><td>"+d[4] +"</td></tr>";
       
        $("#admindata").append(str);

      }
      $("#emppage").hide();      
      $("#officepage").hide();
      $("#signuppage").hide();
      $("#adminPage").show();
    }
    else
    {
        if(role == "1"){
          //Office
          
          $("#emppage").hide();         
          $("#officepage").show();
          $("#signuppage").hide();
          $("#adminPage").hide();

          var count = await App.employee.total();
          var c = parseInt(count);
          
          $("#empoptions").empty();
          var a = 0;
          for(var i= 1; i<=c; i++){
            var d = await App.employee.empInfo(parseInt(i)); 
              
            if(d[4] == "2")
            {
              
              var str = "<option value=" + i +">"+i+"</option>";
              $("#empoptions").append(str);
            
              if(a==0)
              {
                
                $("#displayoname").val(d[0]);
                $("#displayoname").val(d[0]);
                $("#displayoemail").val(d[1]);
                $("#displayophone").val(d[2]);
                $("#displayosalary").val(d[3].toString());
                a=1;

              }     
          }
        }

          
        }
        else if(role == "2"){
          //employee
          $("#emppage").show();         
          $("#officepage").hide();
          $("#signuppage").hide();
          $("#adminPage").hide();

          var count = await App.employee.total();
          var c = parseInt(count);
          
          for(var i= 1; i<= c; i++){
            var d = await App.employee.empInfo(parseInt(i));   
            if(d[5].toString().toUpperCase() == App.account.toString().toUpperCase())
            {
              $("#displayname").html(d[0]);
              $("#displayemail").html(d[1]);
              $("#displayphone").html(d[2]);
              $("#displaysalary").html(d[3].toString());

            }     
          }
        }
        
        else{
          $("#emppage").hide();         
          $("#officepage").hide();
          $("#signuppage").show();
          $("#adminPage").hide();
          
        }
    }
    
  } 
  

};
