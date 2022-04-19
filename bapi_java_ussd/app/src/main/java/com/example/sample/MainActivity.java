package com.example.sample;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    public static final String USERNAME = "USERNAME";

    private Button mConnexionButton;

    private EditText mUsernameEditText;
    private EditText mPasswordEditText;

    private TextView mConnexionResponseTextview;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mConnexionButton = (Button)  findViewById(R.id.main_button_connexion) ;
        mUsernameEditText = (EditText) findViewById(R.id.main_edittext_username);
        mPasswordEditText = (EditText) findViewById(R.id.main_edittext_password);
        mConnexionResponseTextview = (TextView) findViewById(R.id.main_textview_connexionResponse);

        mConnexionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Boolean usernameIsEmpty = mUsernameEditText.getText().toString().isEmpty();
                Boolean passwordIsEmpty = mPasswordEditText.getText().toString().isEmpty();

                if(usernameIsEmpty || passwordIsEmpty){
//                    mConnexionResponseTextview.setText("Echec de connexion");
                    Toast.makeText(MainActivity.this, "Echec de connexion", Toast.LENGTH_SHORT).show();
                }else{

                    String username = mUsernameEditText.getText().toString();
                    String password = mPasswordEditText.getText().toString();

//                    if(username == "prosper" && password == "xvision"){
//                        Toast.makeText(MainActivity.this, "Connexion reussie", Toast.LENGTH_SHORT).show();
//                        Intent i = new Intent(MainActivity.this, ManagerActivity.class);
//                        i.putExtra(USERNAME, mUsernameEditText.getText().toString());
//                    }else{
//                        String message = "Echec de connexion " + username;
//                        Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
//                    }

                    Toast.makeText(MainActivity.this, "Connexion reussie", Toast.LENGTH_SHORT).show();
                    Intent i = new Intent(MainActivity.this, ManagerActivity.class);
                    i.putExtra(USERNAME, mUsernameEditText.getText().toString());
                    startActivity(i);

                }


//                if(!mUsernameEditText.getText().toString().isEmpty()){
//                    Intent i  = new Intent(MainActivity.this, ManagerActivity.class);
//                    i.putExtra(USERNAME,mUsernameEditText.getText().toString());
//                    startActivity(i);
//                }


            }
        });

    }
}