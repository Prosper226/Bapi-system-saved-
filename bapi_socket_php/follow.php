<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PMU follow</title>

    <link rel="stylesheet" href="style.css">
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,300,700' rel='stylesheet' type='text/css'>

	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="icon" href="favicon.png" type="image/png">

</head>
<body>
    <aside>
        <ul id="tabs">
            <li class="active" data-room="general"># Listening transactions <span id="socket"></span></li>
            <li class="" data-room="general"># Count    : <span id="count">0</span></li>
            <li class="" data-room="general"># Deposit: <span id="deposit">0</span></li>
            <li class="" data-room="general"># Withdrawal: <span id="withdrawal">0</span></li>
            <!-- <li class="active" data-room="general">@ balance <span id="socket"></span></li> -->
        </ul>
    </aside>
    <main>
        <div id="content">
            <div id="writing"></div>
            <div id="messages"></div>
        </div>
        
        <form>
            <input type="text" id="name" placeholder="">
            <input type="text" id="message" placeholder="">
            <!-- <button>Envoyer</button> -->
        </form>
    </main>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script>
        // const socket = io("http://192.168.1.103:7585");
        const socket = io("https://642f-41-203-239-62.ngrok.io");
        $(document).ready(function($) {
            $('#socket').text("(disconnect)");

            $('#count').val(0);
            var count = $('#count').val();

            $('#deposit').val(0);
            var deposit_count = $('#deposit').val();

            $('#withdrawal').val(0);
            var withdrawal_count = $('#withdrawal').val();


            socket.emit("php_connect", "general");

            socket.on("complete_transaction", data => {
                console.log(data)
                socket.emit('php_receive', "success");
                publishMessages(data)

                /**
                 * 
                 * Make ajax request here
                 * 
                 */

                count++
                $('#count').val(count);
                $('#count').text(count)

                if(data.type == 'withdrawal'){
                    withdrawal_count++
                    $('#withdrawal').val(withdrawal_count);
                    $('#withdrawal').text(withdrawal_count)
                }else{
                    deposit_count++
                    $('#deposit').val(deposit_count);
                    $('#deposit').text(deposit_count)
                }
            }); 


            socket.on("node_connect", data => {
                $('#socket').text("(online)")
            });


            function publishMessages(data){
                var trans_date = new Date();
                var time = trans_date.toLocaleTimeString();
                var today = trans_date.toLocaleDateString();
                var iso = trans_date.toISOString();
                console.log(today)
                let table =  `<div style="padding-left: 25%; padding-top: 10%; margin:auto">
                                    <table class="styled-table">
                                        <thead>
                                            <tr>
                                                <th>#${time}</th>
                                                <th align="center">TRANSACTION #${data.type}</th>
                                            </tr>
                                            <tr>
                                                <th>Property</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>TransId</td>
                                                <td>${data.transId}</td>
                                            </tr>
                                            <tr>
                                                <td>Bash</td>
                                                <td>${data.bash}</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>${data.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>Phone</td>
                                                <td>${data.phone}</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>${data.type}</td>
                                            </tr>
                                            <tr>
                                                <td>Status</td>
                                                <td>${data.status}</td>
                                            </tr>
                                            <tr>
                                                <td>Created_at</td>
                                                <td>${data.created_at}</td>
                                            </tr>
                                            <tr>
                                                <td>Orange Id</td>
                                                <td>${data.orange_transId}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="2" align="center">#${iso}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>`
                    
                var elem = document.querySelector("#messages");
                console.log(time);
                elem.innerHTML = table + elem.innerHTML;
                
            }

        });
        
    </script> 
</body>
</html>