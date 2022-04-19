package com.example.sample.EXTRA;

import android.util.Base64;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

public class Crypted {

    private static final String AES = "AES";


    private SecretKeySpec generateKey(String secret) throws Exception{
        final MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        digest.update(bytes, 0, bytes.length);
        byte[] key = digest.digest();
        return new SecretKeySpec(key, "AES");
    }


    public String decrypt(String data, String secret) throws Exception{
        SecretKeySpec key = generateKey(secret);
        Cipher c = Cipher.getInstance(AES);
        c.init(Cipher.DECRYPT_MODE, key);
        byte[] decodeValue = Base64.decode(data, Base64.DEFAULT);
        byte[] decVal = c.doFinal(decodeValue);
        return Base64.encodeToString(decVal, Base64.DEFAULT);
    }

    public String encrypt(String data, String secret) throws Exception{
        SecretKeySpec key = generateKey(secret);
        Cipher c = Cipher.getInstance(AES);
        c.init(Cipher.ENCRYPT_MODE, key);
        byte[] encVal = c.doFinal(data.getBytes());
        return Base64.encodeToString(encVal, Base64.DEFAULT);
    }



}
