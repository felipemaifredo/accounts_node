//Imports
import chalk from 'chalk';
import inquirer from 'inquirer';

import fs from 'fs';


function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'O que você deseja fazer?',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sair',
        ]
    }]).then((answer) => {
        const action = answer['action'];
        switch (action) {
            case 'Criar Conta':
                    createAccount();
                break;
            case 'Consultar Saldo':
                    getAccountBalance();
                break;
            case 'Depositar':
                    depositMoney();
                break;
            case 'Sair':
                    exitAccounts();
                break;
            default:
                console.log('Escolha inválida');
        }
    }).catch((err) => console.log(err));
} operation();

function createAccount() {
    console.log(chalk.bgGreen.black('Parabéms por escolher nosso banco!'));
    console.log(chalk.green('Defina as opções da sua conta a seguir:'))
    buildAccount();
}

function buildAccount() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para sua conta:',
    }]).then((answer) => {
        const accountName = answer['accountName'];
        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Essa conta já existe, escolha outro nome!'))
            buildAccount();
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', (err) => {
                console.log(err)
            },
        );

        console.log(chalk.green(`Parabéns, sua conta ${accountName} foi criada com sucesso!`));

        operation();
    })
};

function depositMoney() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?',
    }]).then((answer) => {
        const accountName = answer['accountName'];
        //Verify if account
        if (!checkAccount(accountName)) {
            return depositMoney();
        }
        inquirer.prompt([{
            name: 'amount',
            message: 'Qual o valor que deseja depositar?'
        }]).then((answer) => {
            const amount = answer['amount'];

            if (!amount) {
                console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'));
                return depositMoney();
            }

            //Add 
            addAmount(accountName, amount);
            operation();
        }).catch((err) => console.log(err));
    }).catch((err) => console.log(err))
}

function checkAccount(accountName) {
    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Essa conta não existe, escolha outra conta'))
        return false
    }
    return true
}

function exitAccounts() {
    console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'));
    process.exit();
}


function addAmount(accountName, amount) {
    const accountData = getAccount(accountName);
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        (err) => console.log(err)
    )
    console.log(chalk.bgGreen.white(`o valor de R$${amount} foi depositado na conta ${accountName}, Obrigado por utilizar nossos serviços, faça uma nova operação no menu a seguir:`))
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJSON);

}

function getAccountBalance() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta?'
    }]).then((answer) => {
        const accountName = answer['accountName'];

        if (!checkAccount(accountName)) {
            return getAccountBalance();
        }
        const accountData = getAccount(accountName);

        console.log(chalk.bgBlue.black(`Olá, o Saldo da sua conta é de R$${accountData.balance}`));

        operation();

    }).catch((err) => console.log(err));
}