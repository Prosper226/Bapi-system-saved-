
# BAPI

  Interface de paiement mobile automatique, utilisant 
  l'opérateur téléphonique Orange.
## Auteurs

  - [@Barkalab](https://www.barkalab.com/) entreprise 
  - [@Prospersedgo](https://github.com/Prosper226/) développeur



## API Références


  ### Basic Auth: 

  #### Toutes les requêtes doivent être authentifiées
    Basic aGFlbWFzdTp0b29sYmVsdA==



  ### Obtenir le solde 

  ```http
    GET   /pmu/ussd/merchant/balance
  ```
  #### Réponses
  ```json
    {
        "code": 200, 
        "account": { 
            "phone": 56022159, 
            "amount": 7710, 
            "created_at": 1646843989,
            "updated_at": 1646914151 
        }
    }
  ```



  ### Vérifier une transaction

  ```http
    GET   /pmu/ussd/transaction/check/${pmu-id}
  ```

  | Parametres | Type     | Description                   |   Obligatoire      |
  | :-------- | :------- | :-------------------           | :---               |
  | `pmu-id`  | `string` | identifiant de la transaction  |    **`Oui`**                |

  #### Requête

    https://domaine-name/pmu/ussd/transaction/check/PMU-7161-290676-8458


  #### Réponses

  ##### Cas 1: 
  ```json
    {
        "code": 200,
        "message": "succes",
        "transaction": {
            "transId": "PMU-7161-290676-8458",
            "bash": "D-1234567890",
            "amount": 35,
            "phone": "57474578",
            "type": "deposit",
            "status": 0,
            "created_at": 1646922124
        }
    }
  ```

  ##### Cas 2: 
  ```json
    {
        "code": 404,
        "message": "transaction not found"
    }
  ```


  ###  Initier une transaction de retrait
  
  ```http
      POST    pmu/ussd/transaction/add/withdrawal
  ```

  |  Body     | Type          | Description                                                                   | Obligatoire   |
  |:----      |:-----         |:------                                                                        |:----          |   
  | `amount`  |   `integer`   |   montant à retirer                                                           |   **`Oui`**   |
  | `phone`   |   `integer`   |   numéro de téléphone du bénéficiaire (avec le l'indicatif du pays sans le +) |   **`Oui`**   |
  | `bash`    |   `string`    |   identifiant unique de la transaction sur le serveur en ligne                |   **`Oui`**   |


  #### Requête
  ```json
    {
        "amount" : 25,
        "phone" : 22667171006,
        "bash" : "W-1234567803"
    }
  ```

  #### Réponses

  ##### Cas 1: 
  ```json
    {
        "code": 200,
        "message": {
            "transId": "PMU-7161-276796-6886",
            "bash": "W-1234567803",
            "amount": 25,
            "phone": "67171006",
            "type": "withdrawal",
            "status": 0,
            "created_at": 1646910818
        },
        "success": true
    }
  ```


  ##### Cas 2: 
  ```json
    {
        "code": 400,
        "message": "a withdrawal transaction is already in progress for this phone number",
        "success": false
    }
  ```



  ##### Cas 3:
  ```json
    {
        "code": 402,
        "message": "insufficient balance to initiate this new transaction",
        "success": false
    }
  ```



  ###  Initier une transaction de dépôt

  ```http
      POST    pmu/ussd/transaction/add/deposit
  ```

  |  Body     | Type          | Description                                                                   | Obligatoire   |
  |:----      |:-----         |:------                                                                        |:----          |   
  | `amount`  |   `integer`   |   montant à déposer                                                           |   **`Oui`**   |
  | `phone`   |   `integer`   |   numéro de téléphone du bénéficiaire (avec le l'indicatif du pays sans le +) |   **`Oui`**   |
  | `bash`    |   `string`    |   identifiant unique de la transaction sur le serveur en ligne                |   **`Oui`**   |


  #### Requête
  ```json
    {
        "amount" : 25,
        "phone" : 22667171006,
        "bash" : "D-1234567803"
    }
   ```

  #### Réponses

  ##### Cas 1: 
  ```json
    {
        "code": 200,
        "message": {
            "transId": "PMU-7161-290676-8458",
            "bash": "D-1234567890",
            "amount": 35,
            "phone": "57474578",
            "type": "deposit",
            "status": 0,
            "created_at": 1646922124
        },
        "success": true
    }
  ```

  ##### Cas 2: 
  ```json
    {
        "code": 400,
        "message": "a deposit transaction is already in progress for this phone number",
        "success": false
    }
  ```

## Installation

### Outils

  #### Sur mac os

  ##### Homebrew
  ```https 
    - https://brew.sh/#install
    - https://docs.brew.sh/Installation
  ```
  ```bash
    mkdir homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
    eval "$(homebrew/bin/brew shellenv)"
    brew update --force --quiet
    chmod -R go-w "$(brew --prefix)/share/zsh"
  ```

  ##### mongoDB 
  ```https 
    compas      =>  https://www.mongodb.com/try/download/compass
    community   =>  https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/
  ```
  ```bash
    brew tap mongodb/brew
    brew install mongodb-community@5.0
    brew services start mongodb-community@5.0
  ```

  
  ##### ngrok
  ```https
    - https://gist.github.com/wosephjeber/aa174fb851dfe87e644e#file-ngrok-installation-md
    - https://ngrok.com/download
  ```
  ```bash
    brew install ngrok/ngrok/ngrok
  ```


  ##### vscode
  ```https
    - https://code.visualstudio.com/download
    - https://formulae.brew.sh/cask/visual-studio-code
  ```
  ```bash
    brew install --cask visual-studio-code
  ```

  ##### android Studio
  ```https
    - https://developer.android.com/
  ```
  ```bash
    brew install --cask android-studio
  ```
  
    
## Déploiement

### Mise en place des tunnels ngrok

  #### Configurations
  
  Terminal
  ```
  Ouvrir le terminal
  ```
  
  Installer le [**_token_**](https://dashboard.ngrok.com/get-started/your-authtoken)
  ```bash
  ngrok authtoken <YOUR_AUTHTOKEN>
  ```

  Fichier de configurations
  ```bash
  nano .ngrok2/ngrok.yml
  ```

  Saisir les configurations suivantes 
  ```
  authtoken: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    tunnels:
      bapi_main:
        proto: http
        addr: 7575
        auth: "username:password"
        bind-tls: true
      bapi_ussd:
        proto: http
        addr: 7580
        bind-tls: true
      bapi_sms:
        proto: http
        addr: 7585
        bind-tls: true
  ```

  #### Démarrer les tunnels
  ``` bash
    ngrok start --all
  ```
  >   A present la tunnelisation par ngrok est terminee.
  Copiez l'adresse web associée à l'hôte localhost:7575 pour le client (serveur web en ligne)
 


### Mise de place de l'application USSD
 
Ouvrir le code source de l'application mobile, sur android studio et naviguer sur 
>  app
>> src
>>> main
>>>> java
>>>>> com
>>>>>>example

ou 
> app
>>java
>>> com.example.sample

Ouvrir le fichier **ManagerActivity.java**
___ 
Instancier l'objet socket avec l'adresse web du tunnel ngrok associée l'hôte localhost:7580
```java
    @Override
    protected void onCreate(Bundle savedInstanceState) {
       
        try {
            socket = IO.socket("https://5bc6-41-203-239-62.ngrok.io");
            socket.connect();
            socket.emit("join", username);

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
```
> Exécuter, l'application sur le smartphone android
```
    - aller dans Paramètres
    - puis dans Accessibilité
    - sélectionner Services installés
    - cliquer sur BAPI
    - activer le toogle

```


### Mise de place de l'application SMS 
Ouvrir le code source de l'application mobile, sur android studio et naviguer sur 
>  app
>> src
>>> main
>>>> java
>>>>> com
>>>>>>example

ou 
> app
>>java
>>> com.example.sms

Ouvrir le fichier **SmsListener.java**
___ 
Instancier l'objet socket avec l'adresse web du tunnel ngrok associée l'hôte localhost:7585
```java
    public SmsListener() {
        try {
            socket = IO.socket("https://fe93-41-203-239-62.ngrok.io");
            socket.connect();
            smsManager = new SmsManager(socket);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }
```
> Exécuter, l'application sur le smartphone android
```
    - aller dans Paramètres
    - puis dans Applications
    - sélectionner BAPI_SMS
    - cliquer sur Autorisations
    - activer l'Autorisation SMS
```



## Exécution

Cloner le projet

```bash
  git clone https://github.com/Prosper226/pmu-nodeJs
```

Aller dans le répertoire du projet

```bash
  cd pmu-nodeJs
```

Installer les dépendences

```bash
  npm install
  npm update -g
```

>   Mettre a jour la variable d'environnement *BAPI_SEND_MONEY_ENDPOINT* 
par l'adresse web du tunnel ngrok associée à l'hôte localhost:7580
```bash
    nano .env
```
```env
    BAPI_SEND_MONEY_ENDPOINT = "https://ec06-41-203-229-205.ngrok.io/sendMoney"
```


####  Démarrer les serveurs
Serveur MAIN
```bash
  npm start
```
Serveur USSD
```bash
  npm run ussd
```
Serveur SMS
```bash
  npm run sms
```


## Technologies

Langages et technologies programmation employes:


#### - Langages
>
|   Badge       |   Nom         |    
| :---          |    :---       |
|![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white)  | **`JAVA`** |
|![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)| **`JavaScript`**|


#### - Environnements
>
|   Badge       |   Nom         |    
| :---          |    :---       |
|![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) | **`NodeJS`**|
|![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)  | **`Android`** |
| ![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) | **`Vscode`** |


#### - Serveurs
>
|   Badge       |   Nom         |    
| :---          |    :---       |
| ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)   | **`Express`** |


#### - Base de données
>
|   Badge       |   Nom         |    
| :---          |    :---       |
|![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)    | **`mongodb`**   |


#### - Testeurs API
>
|   Badge       |   Nom         |    
| :---          |    :---       |
| ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)    | **`Postman`** |


#### - Autres
>
|   Badge       |   Nom         |    
| :---          |    :---       |
| ![Xcode](https://img.shields.io/badge/Xcode-007ACC?style=for-the-badge&logo=Xcode&logoColor=white)  | **`Xcode`**   |



**Langages:** Java, Javascript

**Environnement:** Node.js, Android Studio , vscode

**Serveur**: Express.js

**Base de données:** MongoDB

**Testeur API:** Postman, Thunder Client

**Autres:** xcode 