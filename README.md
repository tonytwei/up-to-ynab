# Up Bank to YNAB

Automatically add your up transactions to YNAB.  
(This one doesn't use serverless stuff)

## Requirements

- Up Bank Account
- YNAB Account

## Checking out

```bash
git clone https://github.com/NotActuallyTerry/up-to-ynab
cd up-to-ynab
```

## Configuring your bridge

### Config File

1. Copy `src/config.example.json` to `src/config.json`
2. Get the needed tokens by doing the following:

#### UpApiSecret

Head to https://api.up.com.au/getting_started and follow the instructions to get a key.

#### ynabApiSecret

Head to https://app.youneedabudget.com/settings/developer and create a new Personal Access Token.

#### ynabBudgetId

You can get your YNAB Budget ID by visiting you budget in YNAB. Your URL will look like:   
`https://app.youneedabudget.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.   
The `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` portion is your YNAB Budget ID.

#### upWebhookSecret

Figure out where on the web this script will be reachable, and run this:   
`./upwebhook.sh --api_key up:demo:WknwVXxOvTk2AfTU --webhook https://up-api.example.com/ping-me`   
REPLACING THE DEFAULTS   
In amongst this, you'll find a `secretKey` property, grab the value of this and yeet it into your config.

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

## Development

yeah send in PRs i guess
