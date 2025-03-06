# Up Bank to YNAB

Automatically add your up transactions to YNAB.  
(This one doesn't use serverless stuff)

Want something you can deploy into your serverless environment? [Check out the original version by daveallie!](https://github.com/daveallie/up-bank-ynab-transformer)

## Requirements

- Up Bank Account
- YNAB Account
- AWS Account

## Checking out

```bash
git clone https://github.com/NotActuallyTerry/up-to-ynab
cd up-to-ynab
```

## Configuration

### Config File

1. Copy `src/config.example.json` to `src/config.json`
2. Get the needed tokens by doing the following:

#### UpApiSecret

Head to https://api.up.com.au/getting_started and follow the instructions to get a key.

#### ynabApiSecret

Head to https://app.youneedabudget.com/settings/developer and create a new Personal Access Token.

#### ynabBudgetId

You can get your YNAB Budget ID by visiting your budget in YNAB. Your URL will look like:   
`https://app.youneedabudget.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.   
The `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` portion is your YNAB Budget ID.

#### upWebhookSecret

1. Create a AWS Lambda Function
2. Create an AWS Api Gateway
3. Create a route e.g. /up-to-ynab
4. Configure route to integrate with lambda function
5. Deploy api route, save url e.g. https://xxxx.execute-api.us-east-1.amazonaws.com/up-to-ynab
6. Run script
`./upwebhook.sh --api_key <UpApiSecrect> --webhook <ApiRoute>`
6. Script should return `secretKey` property, use as `upWebhookSecret`

### Setting Up Account Mappings

1. Copy `src/accountMapping.example.json` to `src/accountMapping.json`.
2. In `accountMapping.json`, leave the transactional and catchall account but create one entry per Up Saver you'd like
   to map out. Any savers you don't explicitly map out will have their transactions go into the catchall account. The
   names are aesthetic and just help you to connect the accounts, they don't need to match anything else.
3. Run the following, replacing `<UP_API_SECRET>` with your Up API Secret.

```bash
curl https://api.up.com.au/api/v1/accounts -G -H 'Authorization: Bearer <UP_API_SECRET>'
# Response should contain one transactional account, and as many savers as you have.
```

4. For the transactional account and each saver you have in `accountMapping.json`, replace the `upId` with the relevant
   `id` from the curl response.
5. In YNAB, create a new account for the Up Transaction account, each Saver you have mapped and a catchall account.
6. For each mapping in `accountMapping.json`, open the YNAB account, your URL should look like
   `https://app.youneedabudget.com/zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz/accounts/yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy`.
   Take the `yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy` portion and set the `ynabId` in `accountMapping.json`.

## Deployment

1. Run `tsc`, creating a `dist` directory
2. Run `npm install --production`
3. Copy `node_modules` into dist directory
4. Zip `dist` directroy
5. Upload zip to lambda function
6. Update lambda function's runtime to Node.js 22.x
7. Update lambda function's handler to `lambda.handler`
8. Increase lambda function's timeout configuration (e.g. from 3s to 1min), due to slow api responses

## Development

yeah send in PRs i guess
