package com.example.sample;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;

import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.net.URISyntaxException;

import com.example.sample.EXTRA.Permission;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;
import com.github.nkzawa.socketio.client.Socket;

import org.json.JSONException;
import org.json.JSONObject;


public class ManagerActivity extends AppCompatActivity {

    final Handler handler = new Handler();

    private String username;

    private Socket socket;

    public Button mTestButton;
    public Button mCloseButton;
    public Button mPingButton;

    public TextView mUssdResultTextview;
    public TextView mUsernameTextview;
    public TextView mFooterTextview;

    final Permission permission = new Permission(this,this);
    final UssdController ussdController = new UssdController(this);

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_manager);

        // Phone permissions settings
        permission.READ_PHONE_STATE();
        permission.CALL_PHONE();
        permission.INTERNET();

        // ussd Controller



//        this.map.put("KEY_LOGIN", new HashSet(Arrays.asList("espere", "waiting", "loading", "esperando")));
//        this.map.put("KEY_ERROR", new HashSet(Arrays.asList("problema", "problem", "error", "null")));


        username = (String) getIntent().getExtras().getString(MainActivity.USERNAME);
        mUssdResultTextview = (TextView) findViewById(R.id.manager_textview_ussdResponse);
        mUsernameTextview = (TextView) findViewById(R.id.manager_textview_username);
        mFooterTextview = (TextView) findViewById(R.id.manager_textview_footer);


        try {

//            socket = IO.socket("http://127.0.0.1:1580");
            socket = IO.socket("https://d63a-41-203-227-67.ngrok.io");
            socket.connect();
            socket.emit("join", username);

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }



        mTestButton = (Button) findViewById(R.id.manager_button_test);
        mCloseButton = (Button) findViewById(R.id.manager_button_close);
        mPingButton = (Button) findViewById(R.id.manager_button_ping);


        mCloseButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onDestroy();
            }
        });

        mPingButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mFooterTextview.setText("");
                socket.emit("messagedetection",username,"messagetxt.getText().toString(ping)");
            }
        });

        mTestButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mFooterTextview.setText("");
                mUssdResultTextview.setText("");
                String data = "Oxv5ASMMgNejsa/hZxxwwRryFU3fg9RpC7bOQ44BcL37EMbPLeGsK3ESzvjGgbt6Y3d0NBVIGRqXHJPmZ7Q0oLZirZzTsY3KqaQuhsy83tm5cJq+fEbDMbRReJjMf13I";
                String secret = "969d9c9717ce3a416646eef722c191b2";
                try {
                    String dec = "decrypt(data, secret)";
                    mUssdResultTextview.setText(dec);
                } catch (Exception e) {
                    e.printStackTrace();
                    mUssdResultTextview.setText(e.getMessage());
                }
            }
        });



        socket.on("userjoinedthechat", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String data = (String) args[0];
                        Toast.makeText(ManagerActivity.this,data,Toast.LENGTH_SHORT).show();
                        mUsernameTextview.setText(data);
                    }
                });
            }
        });

        socket.on("userdisconnect", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String data = (String) args[0];
                        Toast.makeText(ManagerActivity.this,data,Toast.LENGTH_SHORT).show();

                    }
                });
            }
        });

        socket.on("message", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject data = (JSONObject) args[0];
                        try {
                            String nickname = data.getString("senderNickname");
                            String message = data.getString("message");
                            Log.d("socket:message ===> ", message);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });

        socket.on("ping", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        String data = (String) args[0];
                        Toast.makeText(ManagerActivity.this,data,Toast.LENGTH_SHORT).show();
                        mFooterTextview.setText(data);
                    }
                });
            }
        });

        socket.on("ussd", new Emitter.Listener() {
            @Override
            public void call(final Object... args) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        JSONObject data = (JSONObject) args[0];
                        try {

                            String request = data.getString("request");
                            Toast.makeText(ManagerActivity.this,request,Toast.LENGTH_SHORT).show();

                            switch (request){
                                case "sendMoney" :
                                        String amount = data.getString("amount");
                                        String phone = data.getString("phone");
                                        String txId = data.getString("txid");
                                        String hash = data.getString("hash");
                                        Log.d("hash: ", hash);

                                        String message = "Currently sending " + amount + " XOF to " + phone + " for transact " + txId;
                                        mUsernameTextview.setText(message);
                                        ManagerActivity.this.sendMoney(amount, phone, txId);

                                    break;

                                case "getBalance" :
                                        int balance = ManagerActivity.this.getBalance();
                                        Toast.makeText(ManagerActivity.this,"Solde: " + String.valueOf(balance),Toast.LENGTH_SHORT).show();
                                    break;

                                default: Log.d("Request", "unavailable request"); break;
                            }

                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                });
            }
        });


    }


    @Override
    protected void onDestroy() {
        socket.disconnect();
        super.onDestroy();
    }


    public void sendMoney(String amount, String phone, String txId){

        Log.d("USSD", "send_money");
        ussdController.sendMoney(amount,phone,txId);
        String message = "Currently sending " + amount + " XOF to " + phone + " for transact " + txId;
        Log.d("send_money", message);
        ((TextView) findViewById(R.id.manager_textview_footer)).setText(message);

    }


    public int getBalance(){

        Log.d("USSD", "get balance");
        int balance  = ussdController.getBalance();
        socket.emit("updateBalance", balance);
        return balance;

    }


    public static void voidCallbackFunc(String message) {
    }


}